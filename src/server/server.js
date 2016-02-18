import path from 'path';
import express from 'express';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from '../../webpack.config.dev';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import morgan from 'morgan';

const isDeveloping = process.env.NODE_ENV != 'production';
const port = process.env.PORT || 5000;
const server = global.server = express();

server.disable('x-powered-by');
server.set('port', port);
server.use(helmet());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(cookieParser());
server.use(morgan('dev'));

server.use('/api/v0/posts', require('./api/posts'));
server.use('/api/v0/post', require('./api/post'));

if (isDeveloping) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: true,
      modules: false,
    },

  });
  server.use(middleware);

  server.use(webpackHotMiddleware(compiler, {
    log: console.log,
  }));
} else {
  server.use('/build/static', express.static(__dirname + '../../../build/static'));
}

server.get('*', (req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <title>React Starter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="React Email Workflow." />
      </head>
      <body>
        <div id="root"></div>
        <script src="/build/static/common.js"></script>
        <script src="/build/static/main.js"></script>
      </body>
    </html>`);
});

server.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }

  console.log(isDeveloping);
  console.info('==> 🌎 Listening on port %s.' +
    'Open up http://0.0.0.0:%s/ in your browser.', port, port);
});

module.exports = server;
