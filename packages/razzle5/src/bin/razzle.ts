#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

(async () => {
  await loadRazzleConfig(webpack).then(
    async ({ razzle, razzleOptions, webpackObject, plugins, paths }) => {
      const parser = yargs(hideBin(process.argv));

      for (const [plugin, pluginOptions] of plugins) {
        // Check if plugin.modifyOptions is a function.
        // If it is, call it on the configs we created.
        if (plugin.modifyYargs) {
          plugin.modifyYargs({
            options: {
              razzleOptions,
              pluginOptions,
            },
            paths,
            parser,
          });
        }
      }

      if (razzle.modifyYargs) {
        // Check if razzle.modifyOptions is a function.
        // If it is, call it on the configs we created.
        razzle.modifyYargs({
          options: {
            razzleOptions,
          },
          paths,
          parser,
        });
      }
    }
  );
})();
