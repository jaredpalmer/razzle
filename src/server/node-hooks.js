import fs from 'fs'
import { interpolateName } from 'loader-utils'
import webpackConfig from '../../webpack.config.dev'

// Helper for webpack loaders to properly resolve module
// imports in node for server-side rendering

// If you add a new extension below, remember to update
// the related file/url loader configuration in webpack.config

const extensions = [
  'png',
  'jpg',
  'jpeg',
  'gif',
  'ico',
  'svg',
  'otf',
  'eot',
  'svg',
  'ttf',
  'woff',
  'woff2'
]

// Allows webpack's node runtime to resolve file/url imports
const requireHook = (context, filename) => {
  const content = fs.readFileSync(filename)

  // Note: filename template must match url/file loader configuration!
  const filenameTemplate = '[name].[hash].[ext]'

  // Resolve using https://github.com/webpack/loader-utils
  const outputName = interpolateName(
    { resourcePath: filename },
    filenameTemplate,
    { content }
  )

  // Export fully resolved path
  context.exports = `${webpackConfig.output.publicPath}${outputName}`
}

extensions.forEach(hook => {
  if (require.extensions[`.${hook}`]) {
    return null
  }

  require.extensions[`.${hook}`] = requireHook
})
