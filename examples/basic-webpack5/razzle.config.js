import { inspect } from 'util';

export default {
    plugins: ['webpack5', 'webpack5-externals', 'webpack5-assets', 'webpack5-babel'],
    modifyConfig: (
        razzleConfig,
        razzleContext,
        webpackOptions,
        webpackConfig
    ) => {
        console.log(inspect(razzleContext, false, 5, true));
        console.log(inspect(webpackOptions, false, 5, true));
        console.log(inspect(webpackConfig, false, 5, true));
        return webpackConfig

    }
}