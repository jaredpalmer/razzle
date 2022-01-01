import { inspect } from 'util';

const localPlugin = {
    defaultOptions: {},
    modifyConfig: (
        pluginOptions,
        razzleContext,
        webpackOptions,
        webpackConfig
    ) => {

        if (true) {
            console.log(inspect(razzleContext, false, 5, true));
            console.log(inspect(webpackOptions, false, 5, true));
            console.log(inspect(webpackConfig, false, 6, true));
        }
        return webpackConfig

    }
}
export default {
    plugins: [{ name: 'webpack5', options: { outputEsm: true } }, 'webpack5-externals', 'webpack5-assets', 'webpack5-babel', localPlugin]
}