import { inspect } from 'util';

export default {
    plugins: [{ name: 'webpack5', options: { outputEsm: true } }, 'webpack5-externals'],
    modifyConfig: (
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