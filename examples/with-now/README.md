# Razzle Now Deployment example

## How to use

Download the example [or clone the whole project](https://github.com/jaredpalmer/razzle.git):

```bash
curl https://codeload.github.com/jaredpalmer/razzle/tar.gz/master | tar -xz --strip=2 razzle-master/examples/with-now
cd with-now
```

### Install it and run locally:

```bash
yarn install
yarn start
```

### Setup Now:

[Now](https://zeit.co/now) manages app deployments with a [desktop](https://zeit.co/download) app or [CLI](https://zeit.co/download#now-cli). You can download either or install the CLI using `npm install -g now`

#### Deploy:

* Create a Now [account](https://zeit.co/signup)
* Authenticate in the desktop app or CLI `now login`
* Deploy using `now` in the root of your app.
* Open your [Dashboard](https://zeit.co/dashboard/deployments) and open your deployment
  * Note: on the free plan your deployment and logs will be **_publicly visible_**

#### Additional Configuration

* Additional build, deployment, and config steps available: [Zeit/Now](https://zeit.co/now#frequently-asked-questions)

## Idea behind the example

This is a basic example of how to use razzle and deploy to [Now](https://zeit.co/now).
