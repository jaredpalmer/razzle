# Razzle Heroku Deployment example

## How to use

Download the example [or clone the whole project](https://github.com/jaredpalmer/razzle.git):

```bash
curl https://codeload.github.com/jaredpalmer/razzle/tar.gz/master | tar -xz --strip=2 razzle-master/examples/with-heroku
cd with-heroku
```

### Install it and run locally:

```bash
yarn install
yarn start
```

### Deploy to Heroku:

[Heroku](https://www.heroku.com/) manages app deployments with [Git](https://devcenter.heroku.com/articles/git) so:

#### Setup Git:

```bash
git init
git add
git commit -m "Heroku deployment, first commit"
```

#### Setup Heroku:

* Create a Heroku [account](https://signup.heroku.com/)
* Install Heroku [CLI](https://devcenter.heroku.com/articles/heroku-cli) and [authenticate](https://devcenter.heroku.com/articles/authentication)
* Create Heroku app: `heroku create`
  * or `heroku create <appname>` if you want to specify an app name (checks for unique app name)
  * or `heroku git:remote -a <appname>` if you already created an App in the [dashboard](https://dashboard.heroku.com/apps)
* Verify with `git remote -v`:

```
heroku	https://git.heroku.com/<appname>.git (fetch)
heroku	https://git.heroku.com/<appname>.git (push)
```

#### Deployment

* `yarn deploy` or `git push heroku master`
  * or from another branch, other than **master**: `git push heroku <feature-branch>:master`
* Console should complete with: **_https://appname.herokuapp.com/ deployed to Heroku_**
* Verify app by opening **_https://appname.herokuapp.com/_**

#### 👉 Please note

* Heroku expects a `yarn.lock` file to be able to recognise _yarn_ as your package manager and process the `yarn` commands - so make sure to run `yarn install` before deployment, and to commit the `yarn.lock` file.

## Idea behind the example

This is a basic example of how to use razzle and deploy to [Heroku](https://www.heroku.com/) with [Git](https://devcenter.heroku.com/articles/git).
