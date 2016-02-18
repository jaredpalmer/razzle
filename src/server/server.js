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
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.min.css">
        <style>
          html {
            box-sizing: border-box;
          }

          *,
          *::before,
          *::after {
            box-sizing: border-box;
          }

          @at-root {
            @-moz-viewport      { width: device-width; }
            @-ms-viewport       { width: device-width; }
            @-o-viewport        { width: device-width; }
            @-webkit-viewport   { width: device-width; }
            @viewport           { width: device-width; }
          }

          html {
          	font-size: 100%;
          	-ms-overflow-style: scrollbar;
          	-webkit-tap-highlight-color: rgba(0,0,0,0);
          	height: 100%;
          }

          body {
          	font-size: 1rem;
          	background-color: #ECEEF1;
          	color: #565a5c;
          	-webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          	font-family: -apple-system, BlinkMacSystemFont,
            "Helvetica Neue", Helvetica, Arial, sans-serif;
          }

          [tabindex="-1"]:focus {
            outline: none !important;
          }

          /* Typography */

          h1, h2, h3, h4, h5, h6 {
            margin: 0;
          }

          p {
            margin: 0;
          }

          abbr[title],
          abbr[data-original-title] {
            cursor: help;
            border-bottom: 1px dotted #eee;
          }

          address {
            margin-bottom: 1rem;
            font-style: normal;
            line-height: inherit;
          }

          ol,
          ul,
          dl {
            margin-top: 0;
            margin-bottom: 1rem;
          }

          ol ol,
          ul ul,
          ol ul,
          ul ol {
            margin-bottom: 0;
          }

          dt {
            font-weight: bold;
          }

          dd {
            margin-bottom: .5rem;
            margin-left: 0;
          }

          blockquote {
            margin: 0 0 1rem;
          }

          /* Links */
          a,
          a:hover,
          a:focus {
          	text-decoration: none;
          }


          /* Code */
          pre {
            margin: 0;
            /*margin-bottom: 1rem;*/
          }
          /* Figures & Images */
          figure {
            margin: 0 0 1rem;
          }

          img {
          	vertical-align: middle;
          }

          [role="button"] {
            cursor: pointer;
          }

          a,
          area,
          button,
          [role="button"],
          input,
          label,
          select,
          summary,
          textarea {
            touch-action: manipulation;
          }

          /* Forms */

          label {
          	display: inline-block;
          	margin-bottom: .5rem;
          }

          button:focus {
            outline: 1px dotted;
            outline: 5px auto -webkit-focus-ring-color;
          }

          input,
          button,
          select,
          textarea {
            margin: 0;
            line-height: inherit;
            border-radius: 0;
          }

          textarea {
            resize: vertical;
          }

          fieldset {
            min-width: 0;
            padding: 0;
            margin: 0;
            border: 0;
          }

          legend {
            display: block;
            width: 100%;
            padding: 0;
            margin-bottom: .5rem;
            font-size: 1.5rem;
            line-height: inherit;
          }

          input[type="search"],
          input[type="text"],
          textarea {
            box-sizing: inherit;
            -webkit-appearance: none;
          }

          [hidden] {
            display: none !important;
          }
        </style>
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
