# Deploy Razzle on Azure

[Install the Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)

Add razzle config

```js
// razzle.config.js
'use strict';

module.exports = {
  options: {
    forceRuntimeEnvVars: ['HOST', 'PORT']
  }
};
```

Create web.config

```xml
<?xml version="1.0" encoding="utf-8"?>
<!--
     web.config
     This configuration file is required if iisnode is used to run node processes behind
     IIS or IIS Express.  For more information, visit:
     https://github.com/tjanczuk/iisnode/blob/master/src/samples/configuration/web.config
-->

<configuration>
  <system.webServer>
    <!-- Visit http://blogs.msdn.com/b/windowsazure/archive/2013/11/14/introduction-to-websockets-on-windows-azure-web-sites.aspx for more information on WebSocket support -->
    <webSocket enabled="false" />
    <handlers>
      <!-- Indicates that the server.js file is a node.js site to be handled by the iisnode module -->
      <add name="iisnode" path="build/server.js" verb="*" modules="iisnode"/>
    </handlers>
    <rewrite>
      <rules>
        <!-- Do not interfere with requests for node-inspector debugging -->
        <rule name="NodeInspector" patternSyntax="ECMAScript" stopProcessing="true">
          <match url="^build/server.js\/debug[\/]?" />
        </rule>

        <!-- First we consider whether the incoming URL matches a physical file in the /public folder -->
        <rule name="StaticContent">
          <action type="Rewrite" url="build/public{REQUEST_URI}"/>
        </rule>

        <!-- All other URLs are mapped to the node.js site entry point -->
        <rule name="DynamicContent">
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True"/>
          </conditions>
          <action type="Rewrite" url="build/server.js"/>
        </rule>
      </rules>
    </rewrite>

    <!-- 'bin' directory has no special meaning in node.js and apps can be placed in it -->
    <security>
      <requestFiltering>
        <hiddenSegments>
          <remove segment="bin"/>
        </hiddenSegments>
      </requestFiltering>
    </security>

    <!-- Make sure error responses are left untouched -->
    <httpErrors existingResponse="PassThrough" />

    <!--
      You can control how Node is hosted within IIS using the following options:
        * watchedFiles: semi-colon separated list of files that will be watched for changes to restart the server
        * node_env: will be propagated to node as NODE_ENV environment variable
        * debuggingEnabled - controls whether the built-in debugger is enabled
      See https://github.com/tjanczuk/iisnode/blob/master/src/samples/configuration/web.config for a full list of options
    -->
    <iisnode watchedFiles="web.config;*.js"/>
  </system.webServer>
</configuration>
```

Zip the Razzle project

```bash
zip -r site.zip * -x "build/*" "node_modules/*"
```

Login to Azure

```bash
az login
```

Deploy the Razzle project to Azure

```bash
webappname=myRazzle$RANDOM

# Create a resource group.
az group create --location westeurope --name myResourceGroup

# Create an App Service plan in `FREE` tier.
az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku FREE --is-linux

# Create a web app.
az webapp create --name $webappname --resource-group myResourceGroup --plan myAppServicePlan --runtime "node|12-lts"

# Enable building with zip deploy
az webapp config appsettings set --name $webappname --resource-group myResourceGroup --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true

# Get FTP publishing profile and query for publish URL and credentials
creds=($(az webapp deployment list-publishing-profiles --name $webappname --resource-group myResourceGroup \
--query "[?contains(publishMethod, 'ZipDeploy')].[publishUrl,userName,userPWD]" --output tsv))

# Use cURL to perform FTP upload. You can use any FTP tool to do this instead.
curl -X POST -u ${creds[1]}:${creds[2]} --data-binary @"site.zip" https://${creds[0]}/api/zipdeploy

# Copy the result of the following command into a browser to see the static HTML site.
echo https://$webappname.azurewebsites.net
```
