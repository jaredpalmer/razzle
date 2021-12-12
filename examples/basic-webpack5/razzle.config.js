import { inspect } from 'util';

export default {
    plugins: ['webpack5', 'webpack5-externals', 'webpack5-babel'],
    modifyWebpackConfig: (
        razzleConfig,
        razzleContext,
        webpackOptions,
        webpackConfig
    ) => {
        console.log(inspect(webpackConfig, false, 5, true));
        return webpackConfig

    }
}