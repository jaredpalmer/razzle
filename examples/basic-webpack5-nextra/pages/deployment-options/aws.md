# Deploy Razzle on AWS


Add razzle config.

```js
// razzle.config.js
'use strict';
const path = require('path');

module.exports = {
  options: {
    buildType: 'serverless'
  },
  modifyPaths({
    paths,
  }) {
    paths.prodAppServerIndexJs = path.join(paths.appSrc, 'index.prod');
    return paths;
  },
  modifyWebpackConfig({
    env: {
      target,
      dev,
    },
    webpackConfig,
    paths,
  }) {
    if (target === 'node') {
      if (!dev) {
        webpackConfig.entry.server = [paths.prodAppServerIndexJs];
      }
    }
    return webpackConfig;
  },
};
```

Modify `src/server.js` like so:

```js
const public_bucket_domain = process.env.PUBLIC_BUCKET_DOMAIN || '';
const public_bucket_url = public_bucket_domain ? `https://${public_bucket_domain}` : '';

const cssLinksFromAssets = (assets, entrypoint) => {
  return assets[entrypoint] ? assets[entrypoint].css ?
  assets[entrypoint].css.map(asset=>
    `<link rel="stylesheet" href="${public_bucket_url}${asset}">`
  ).join('') : '' : '';
};

const jsScriptTagsFromAssets = (assets, entrypoint, extra = '') => {
  return assets[entrypoint] ? assets[entrypoint].js ?
  assets[entrypoint].js.map(asset=>
    `<script src="${public_bucket_url}${asset}"${extra}></script>`
  ).join('') : '' : '';
};
```

Add this to `src/index.prod.js`

```js
const serverless = require('serverless-http');

module.exports = {
  handler: serverless(require('./server').default)
};
```

Add serverless-http dependency

```bash
yarn add serverless-http
```

Build the Razzle project

```bash
yarn build
```

Init cdk app

```bash
mkdir razzle-cdk
cd razzle-cdk

cdk init app --language typescript
```

Add `razzle-cdk` dependencies in `razzle-cdk` directory

```bash
yarn add @aws-cdk/aws-s3 @aws-cdk/aws-s3-deployment @aws-cdk/aws-lambda @aws-cdk/aws-apigateway @aws-cdk/aws-ssm @aws-cdk/aws-secretsmanager --dev
```

Add `razzle-cdk/bin/razzle-cdk.ts`

```typescript
// bin/cdk.ts
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { RazzleCdkStack } from '../lib/razzle-cdk-stack';

const app = new cdk.App();
new RazzleCdkStack(app, 'RazzleCdkStack', {name:'basic'});
```

Add `razzle-cdk/lib/helpers.ts`

```typescript
// razzle-cdk/lib/helpers.ts
import * as SSM from '@aws-cdk/aws-ssm';
import * as CDK from '@aws-cdk/core';

export const getParam = (scope: CDK.Construct, name: string) => {
  return SSM.StringParameter.valueForStringParameter(scope, name);
};

export interface ConfigProps extends CDK.StackProps {
  name: string;
}

export class ModeStack extends CDK.Stack {
  public readonly mode: string = this.node.tryGetContext('mode') || 'development';
  public readonly Mode: string =
    this.mode.replace(/^\w/, (c: string) => c.toUpperCase());

  constructor(scope: CDK.Construct, id: string, props?: ConfigProps) {
    super(scope, id, props);
  }
}
```

Add `razzle-cdk/lib/razzle-cdk-stack.ts`

```typescript
// razzle-cdk/lib/razzle-cdk-stack.ts
import * as CDK from '@aws-cdk/core';
import * as S3 from '@aws-cdk/aws-s3';
import * as S3Deployment from '@aws-cdk/aws-s3-deployment';
import * as Lambda from '@aws-cdk/aws-lambda';
import * as APIGateway from '@aws-cdk/aws-apigateway';
import * as SSM from '@aws-cdk/aws-ssm';
import * as SecretsManager from '@aws-cdk/aws-secretsmanager';

import { ConfigProps, getParam, ModeStack } from './helpers';

export class RazzleCdkStack extends ModeStack {
  constructor(app: CDK.App, id: string, props: ConfigProps) {
    super(app, id, props);

    /**
     * S3 bucket to the /public folder
     */
    const publicBucketName = `my-razzle-app-bucket-public-files-${this.mode}`;
    const bucketPublicFiles = new S3.Bucket(this, publicBucketName, {
      publicReadAccess: true,
      bucketName: publicBucketName.toLowerCase(),
    });

    /**
     * Store S3 bucket name
     */
    new SSM.StringParameter(this, `MyRazzleAppBucketAssetsName${this.Mode}`, {
      description: `My Razzle App S3 Bucket Name for Assets on ${this.Mode}`,
      parameterName: `/${props.name}/S3/Assets/Name`,
      stringValue: bucketPublicFiles.bucketName,
    });

    /**
     * Store S3 domainName name
     */
    new SSM.StringParameter(this, `MyRazzleAppBucketAssetsDomainName${this.Mode}`, {
      description: `My Razzle App S3 Bucket DomainName for Assets on ${this.Mode}`,
      parameterName: `/${props.name}/S3/Assets/DomainName`,
      stringValue: bucketPublicFiles.bucketDomainName,
    });

    /**
     * Deploy public folder of build to `my-razzle-app-bucket-public-files-${this.mode}` bucket
     */
    new S3Deployment.BucketDeployment(this, `${publicBucketName}-deploy`, {
      sources: [S3Deployment.Source.asset('../build/public')],
      destinationBucket: bucketPublicFiles,
    });

    /**
     * Environment Variables for SSR Function
     */
    const environmentKeys = [
      'NODE_ENV',
    ];

    const environmentSecret = SecretsManager.Secret.fromSecretAttributes(
      this,
      `MyRazzleAppEnvironmentSecret${this.Mode}`,
      {
        secretArn: getParam(this, `MyRazzleAppSecretsArn${this.Mode}`),
      },
    );

    let environment: { [key: string]: string } = {};
    for (const key of environmentKeys) {
      environment[key] = environmentSecret.secretValueFromJson(key).toString();
    }

    environment['PUBLIC_BUCKET_DOMAIN'] = bucketPublicFiles.bucketRegionalDomainName;

    /**
     * Razzle SSR Function
     */
    const myRazzleAppSsrFunction = new Lambda.Function(this, `MyRazzleAppSSRFunction${this.Mode}`, {
      description: `Lambda Function that runs My Razzle App SSR on ${this.Mode}`,
      code: Lambda.Code.fromAsset('../build', {
        exclude: ['public', 'static', '*.json'],
      }),
      handler: 'server.handler',
      runtime: Lambda.Runtime.NODEJS_12_X,
      memorySize: 512,
      timeout: CDK.Duration.seconds(5),
      environment,
      tracing: Lambda.Tracing.ACTIVE,
    });

    /**
     * Razzle ApiGateway
     */
    const razzleSsrApiGatewayName = `MyRazzleAppSSRApiGateway${this.Mode}`;
    const api = new APIGateway.RestApi(this, razzleSsrApiGatewayName, {
      description: `ApiGateway that exposes My Razzle App SSR on ${this.Mode}`,
      binaryMediaTypes: ['*/*'],
      endpointTypes: [APIGateway.EndpointType.REGIONAL],
      deployOptions: {
        stageName: this.mode,
      },
    });
    const integration = new APIGateway.LambdaIntegration(myRazzleAppSsrFunction);
    const root = api.root;
    const pathApi = api.root.addResource('{proxy+}');

    root.addMethod('GET', integration);
    pathApi.addMethod('ANY', integration);

    /**
     * Razzle ApiGateway ID
     */
    new SSM.StringParameter(this, `MyRazzleAppAPIGatewayRestId${this.Mode}`, {
      description: `My Razzle App ApiGateway ID on ${this.Mode}`,
      parameterName: `/${props.name}/APIGateway/ApiId`,
      stringValue: api.restApiId,
    });
  }
}
```

Bootstrap and deploy

```bash
aws configure
echo '{"NODE_ENV": "development" }' | jq '.' > mycreds.json
aws secretsmanager create-secret --name MyRazzleAppEnvironmentSecretDevelopment \
    --description "My Development secrets created with the CLI" \
    --secret-string file://mycreds.json > arn.json
arn=($(cat arn.json | jq --raw-output '.ARN'))
echo $arn
aws ssm put-parameter --name=MyRazzleAppSecretsArnDevelopment --value=$arn
yarn cdk bootstrap
yarn cdk deploy
```
