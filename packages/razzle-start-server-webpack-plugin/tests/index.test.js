import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import expect from 'expect';
import {compareDirectory, compareWarning} from './utils';
import Plugin from '..';

const webpackMajorVersion =
  typeof webpack.version !== 'undefined' ? parseInt(webpack.version[0]) : 3;

describe('StartServerPluginWebpackCases', () => {
  const casesDirectory = path.resolve(__dirname, 'cases');
  const outputDirectory = path.resolve(__dirname, 'js');

  for (const directory of fs.readdirSync(casesDirectory)) {
    if (!/^(\.|_)/.test(directory)) {
      // eslint-disable-next-line no-loop-func
      it(`${directory} should compile and start the server`, (done) => {
        const directoryForCase = path.resolve(casesDirectory, directory);
        const outputDirectoryForCase = path.resolve(outputDirectory, directory);
        // eslint-disable-next-line import/no-dynamic-require, global-require
        const webpackConfig = require(path.resolve(
          directoryForCase,
          'webpack.config.js'
        ));

        for (const config of [].concat(webpackConfig)) {
          Object.assign(
            config,
            {
              context: directoryForCase,
              output: Object.assign(
                {
                  path: outputDirectoryForCase,
                },
                config.output
              ),
            },
            config
          );
        }

        webpack(webpackConfig, (err, stats) => {
          if (err) {
            done(err);
            return;
          }

          /*
          // eslint-disable-next-line no-console
          console.log(
            stats.toString({
              context: path.resolve(__dirname, '..'),
              chunks: true,
              chunkModules: true,
              modules: false,
            })
          );
          */

          if (stats.hasErrors()) {
            done(
              new Error(
                stats.toString({
                  context: path.resolve(__dirname, '..'),
                  errorDetails: true,
                })
              )
            );

            return;
          }

          const expectedDirectory = path.resolve(directoryForCase, 'expected');
          const expectedDirectoryByVersion = path.join(
            expectedDirectory,
            `webpack-${webpackMajorVersion}`
          );

          if (fs.existsSync(expectedDirectoryByVersion)) {
            compareDirectory(
              outputDirectoryForCase,
              expectedDirectoryByVersion
            );
          } else if (fs.existsSync(expectedDirectory)) {
            compareDirectory(outputDirectoryForCase, expectedDirectory);
          }

          const expectedWarning = path.resolve(directoryForCase, 'warnings.js');
          if (fs.existsSync(expectedWarning)) {
            const actualWarning = stats.toString({
              all: false,
              warnings: true,
            });
            compareWarning(actualWarning, expectedWarning);
          }

          done();
        });
      }, 10000);
    }
  }
});

describe('StartServerPlugin', function () {
  it('should be `import`-able', function () {
    expect(Plugin).toBeInstanceOf(Function);
  });

  it('should be `require`-able', function () {
    expect(require('..')).toBe(Plugin);
  });

  it('should accept a string entryName', function () {
    const p = new Plugin('test');
    expect(p.options.entryName).toBe('test');
  });

  it('should accept an options object', function () {
    const p = new Plugin({whee: true});
    expect(p.options.whee).toBe(true);
  });

  it('should calculate nodeArgs', function () {
    const p = new Plugin({nodeArgs: ['meep'], scriptArgs: ['moop']});
    const nodeArgs = p._getExecArgv();
    expect(nodeArgs.filter((a) => a === 'meep').length).toBe(1);
  });

  it('should calculate args', function () {
    const p = new Plugin({
      nodeArgs: ['meep'],
      scriptArgs: ['moop', 'bleep', 'third'],
    });
    const args = p.options.scriptArgs;
    expect(args).toEqual(['moop', 'bleep', 'third']);
  });

  it('should accept string entry', function () {
    const p = new Plugin();
    const entry = p._amendEntry('meep');
    expect(entry).toBeInstanceOf(Array);
    expect(entry[0]).toEqual('meep');
    expect(entry[1]).toContain('monitor');
  });
  it('should accept array entry', function () {
    const p = new Plugin();
    const entry = p._amendEntry(['meep', 'moop']);
    expect(entry).toBeInstanceOf(Array);
    expect(entry.slice(0, 2)).toEqual(['meep', 'moop']);
    expect(entry[2]).toContain('monitor');
  });
  it('should accept object entry', function () {
    const p = new Plugin({entryName: 'boom'});
    const entry = p._amendEntry({boom: 'meep', beep: 'foom'});
    expect(entry.beep).toEqual('foom');
    expect(entry.boom).toBeInstanceOf(Array);
    expect(entry.boom[0]).toEqual('meep');
    expect(entry.boom[1]).toContain('monitor');
  });
  it('should accept function entry', function (cb) {
    const p = new Plugin();
    const entryFn = p._amendEntry((arg) => arg);
    expect(entryFn).toBeInstanceOf(Function);
    const entry = entryFn('meep');
    expect(entry).toBeInstanceOf(Promise);
    entry.then((entry) => {
      expect(entry[0]).toEqual('meep');
      expect(entry[1]).toContain('monitor');
      cb();
    });
  });
});
