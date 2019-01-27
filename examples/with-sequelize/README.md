# Razzle Sequelize Example

## How to use

Download the example [or clone the whole project](https://github.com/jaredpalmer/razzle.git):

```bash
curl https://codeload.github.com/jaredpalmer/razzle/tar.gz/master | tar -xz --strip=2 razzle-master/examples/with-sequelize
cd with-sequelize
```

### Database server

The example comes with a `docker` container to bootstrap a database server. For this to work you should have `docker` installed. If you already have `mysql` installed and want to use that server instead of `docker`, create a `.env` file in the `with-sequelize` root, with the following values:

```
RAZZLE_RUNTIME_DB_PORT=3306
```

In that case, _don't_ run `yarn database:start` in the following section.

#### Other .env values

Additional customization can be achieved with the following `.env` values

```
process.env.RAZZLE_RUNTIME_DB_HOST=localhost
process.env.RAZZLE_RUNTIME_DB_PORT=3307
process.env.RAZZLE_RUNTIME_DB_USER=root
process.env.RAZZLE_RUNTIME_DB_PW=
process.env.RAZZLE_RUNTIME_DB_SCHEMA=razzle
process.env.RAZZLE_RUNTIME_DB_TZ=Etc/UTC
process.env.RAZZLE_RUNTIME_DB_DIALECT=mysql
```

## Install and run

Install it and run:

```bash
yarn install
yarn database:start
yarn database:create
yarn start
```

## Idea behind the example

This is a basic, bare-bones example of how to use razzle with sequelize. It creates a single database table based on a single model object and seeds a record.

For more information about implementing `sequelize`: http://www.sequelizejs.com/
