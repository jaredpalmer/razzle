import { inspect } from 'util';

export default {
    plugins: [{ name: 'webpack5', options: { outputEsm: true } }, 'webpack5-externals', 'webpack5-assets', 'webpack5-babel'],
    modifyConfig: (
        razzleConfig,
        razzleContext,
        webpackOptions,
        webpackConfig
    ) => {
        if (process.env.LOGCONF) {
            console.log(inspect(razzleContext, false, 5, true));
            console.log(inspect(webpackOptions, false, 5, true));
            console.log(inspect(webpackConfig, false, 5, true));
        }
        return webpackConfig

    }
}