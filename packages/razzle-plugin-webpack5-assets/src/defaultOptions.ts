import { Webpack5AssetsPluginOptions } from "./types";

const defaultOptions: Webpack5AssetsPluginOptions = {
  assetResourceExclude: [
    /\.html$/,
    /\.(js|jsx|mjs)$/,
    /\.(ts|tsx)$/,
    /\.(vue)$/,
    /\.(less)$/,
    /\.(re)$/,
    /\.(s?css|sass)$/,
    /\.json$/,
    /\.bmp$/,
    /\.gif$/,
    /\.jpe?g$/,
    /\.png$/,
  ],
  assetAutoTest: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
  assetAutoSize: 1024 * 4,
};

export default defaultOptions;
