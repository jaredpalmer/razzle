"use strict";

const WebpackConfigHelpers = require('razzle-dev-utils/WebpackConfigHelpers');
const Helpers = new WebpackConfigHelpers(process.cwd());

module.exports = function modify(config) {
    // Add .svelte to extensions
    config.resolve.extensions = [...config.resolve.extensions, '.svelte'];

    config.module.rules.push({
        test: /\.svelte$/,
        loader: require.resolve('svelte-loader'),
        options: {
            preprocess: require('svelte-preprocess')({})
        }
    });

};