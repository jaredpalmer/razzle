
export default {
    plugins: [{ name: 'webpack5', options: { outputEsm: true } }, 'webpack5-externals'],
    modifyWebpackConfig: (
        razzleConfig,
        razzleContext,
        webpackOptions,
        webpackConfig
    ) => {
        console.log(webpackConfig);
        return webpackConfig

    }
}