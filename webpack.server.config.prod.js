// jscs:disable
var webpack = require('webpack');
var fs =  require('fs');
var path = require('path');

function getExternals() {
  const nodeModules = fs.readdirSync(path.resolve(__dirname, 'node_modules'));
  return nodeModules.reduce(function (ext, mod) {
    ext[mod] = 'commonjs ' + mod;
    return ext;
  }, {});
}

module.exports = {
  target: 'node',
  devtool: 'inline-source-map',
  entry: './src/server/server.js',
  output: {
    path: __dirname + '/build/server',
    filename: 'index.js'
  },
  externals: getExternals(),
  node: {
    __filename: true,
    __dirname: true
  },
  module: {
    loaders: [{
        test: /\.js$/,
        loader: 'babel-loader?presets[]=es2015&presets[]=react&presets[]=stage-0',
        include: path.join(__dirname, 'src')
      }, {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(gif|jpe?g|png|ico)$/,
        loader: 'url-loader?limit=10000'
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|woff2).*$/,
        loader: 'url-loader?limit=10000'
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin(
        'require("source-map-support").install();',
        { raw: true, entryOnly: false }
    ),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
};
