import { inspect } from 'util';

const localPlugin = {
    defaultOptions: {},
    modifyConfig: (
        pluginOptions,
        razzleContext,
        webpackOptions,
        webpackConfig
    ) => {

        if (false) {
            console.log(inspect(razzleContext, false, 5, true));
            console.log(inspect(webpackOptions, false, 5, true));
            console.log(inspect(webpackConfig, false, 6, true));
        }
        return webpackConfig

    }
}
export default {
    plugins: ['webpack5', 'webpack5-externals', 'webpack5-assets', 'webpack5-babel', 'webpack5-pages', localPlugin ]
}