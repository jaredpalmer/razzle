import { inspect } from 'util';

export default {
    plugins: [{ name: 'webpack5', options: { outputEsm: true } }, 'webpack5-externals'],
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