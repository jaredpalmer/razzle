# Razzle Sequelize Example

## How to use

Download the example [or clone the whole project](https://github.com/jaredpalmer/razzle.git):

```bash
curl https://codeload.github.com/jaredpalmer/razzle/tar.gz/master | tar -xz --strip=2 razzle-master/examples/with-sequelize
cd with-sequelize
```

### Database server

Use one of the following options:

#### Using an existing database server

Create the following `.env` file

```
process.env.RAZZLE_RUNTIME_DB_HOST=localhost
process.env.RAZZLE_RUNTIME_DB_PORT=3306
process.env.RAZZLE_RUNTIME_DB_USER=root
process.env.RAZZLE_RUNTIME_DB_PW=
process.env.RAZZLE_RUNTIME_DB_SCHEMA=razzle
process.env.RAZZLE_RUNTIME_DB_TZ=Etc/UTC
process.env.RAZZLE_RUNTIME_DB_DIALECT=mysql
```

Use the appropriate settings depending on your favourite database. See the `sequelize` documentation for the supported dialects, ports, timezone and other settings.

Run

```
yarn install
yarn database:create
yarn start
```

#### Using docker

The example comes with a mysql `docker` container to bootstrap a database server. For this to work you should have `docker` installed.

By default, it runs on port `3307` and you don't have to create a `.env` file unless you want different defaults than the ones below.

Keep in mind that you can only change `RAZZLE_RUNTIME_SCHEMA` without having to make a change to the docker container configuration in `src/server/sequelize`.

```bash
yarn install
yarn database:start
yarn database:create
yarn start
```

#### Changing .env defaults

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

## Idea behind the example

This is a basic, bare-bones example of how to use razzle with sequelize. It creates a single database table based on a single model object and seeds a record.

For more information about implementing `sequelize`: http://www.sequelizejs.com/
