/**
 * @jest-environment node
 */
'use strict';

const shell = require('shelljs');
const fs = require('fs');

const util = require('../fixtures/util');
const path = require("path");

const silent = !process.env.NOISY_TESTS;
shell.config.verbose = !silent;
shell.config.silent = silent;

const stageName = 'stage-cra';
const craPath = path.join('../node_modules/.bin/create-razzle-app');
const testPackage = 'razzle-example-basic';
const testRepo = 'https://github.com/fivethreeo/razzle-example-basic';

const directoryExists = (dirPath) => fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory();
const fileExists = (dirPath) => fs.existsSync(dirPath);

describe('create-razzle-app', () => {
  beforeAll(() => {
    util.teardownStage(stageName);
  });

  it('should create app from default template', () => {
    util.setupStage(stageName);
    const output = shell.exec(
      `${craPath} cra --no-install`
    );
    expect(directoryExists('cra/node_modules')).toBeFalsy();

    expect(fileExists('cra/yarn.lock')).toBeFalsy();

    expect(fileExists('cra/package.json')).toBeTruthy();

    expect(directoryExists('cra/src')).toBeTruthy();
    expect(fileExists('cra/src/index.js')).toBeTruthy(0);

    expect(output.code).toBe(0);
  });
  //
  // it('should create app from default template and install packages', () => {
  //   util.setupStage(stageName);
  //   const output = shell.exec(
  //     `${craPath} cra`
  //   );
  //   expect(directoryExists('cra/node_modules')).toBeTruthy();
  //
  //   expect(fileExists('cra/yarn.lock')).toBeTruthy();
  //
  //   expect(fileExists('cra/package.json')).toBeTruthy();
  //
  //   expect(directoryExists('cra/src')).toBeTruthy();
  //   expect(fileExists('cra/src/index.js')).toBeTruthy(0);
  //
  //   expect(output.code).toBe(0);
  // });

  it('should create app from official example', () => {
    util.setupStage(stageName);
    const output = shell.exec(
      `${craPath} cra --example=basic --no-install`
    );
    expect(fileExists('cra/package.json')).toBeTruthy();

    expect(directoryExists('cra/src')).toBeTruthy();
    expect(fileExists('cra/src/index.js')).toBeTruthy(0);

    expect(output.code).toBe(0);
  });

  it('should create app from npm example', () => {
    util.setupStage(stageName);
    const output = shell.exec(
      `${craPath} cra --example=${testPackage} --no-install`
    );
    expect(fileExists('cra/package.json')).toBeTruthy();

    expect(directoryExists('cra/src')).toBeTruthy();
    expect(fileExists('cra/src/index.js')).toBeTruthy(0);

    expect(output.code).toBe(0);
  });

  it('should create app from npm example at tag', () => {
    util.setupStage(stageName);
    const output = shell.exec(
      `${craPath} cra --example=${testPackage}@latest --no-install`
    );
    expect(fileExists('cra/package.json')).toBeTruthy();

    expect(directoryExists('cra/src')).toBeTruthy();
    expect(fileExists('cra/src/index.js')).toBeTruthy(0);

    expect(output.code).toBe(0);
  });

  it('should create app from npm example in subdir', () => {
    util.setupStage(stageName);
    const output = shell.exec(
      `${craPath} cra --example=${testPackage}:subexample --no-install`
    );
    expect(fileExists('cra/package.json')).toBeTruthy();

    expect(directoryExists('cra/src')).toBeTruthy();
    expect(fileExists('cra/src/index.js')).toBeTruthy(0);

    expect(output.code).toBe(0);
  });

  it('should create app from github example', () => {
    util.setupStage(stageName);
    const output = shell.exec(
      `${craPath} cra --example=${testRepo} --no-install`
    );
    expect(fileExists('cra/package.json')).toBeTruthy();

    expect(directoryExists('cra/src')).toBeTruthy();
    expect(fileExists('cra/src/index.js')).toBeTruthy(0);

    expect(output.code).toBe(0);
  });

  it('should create app from github example at branch', () => {
    util.setupStage(stageName);
    const output = shell.exec(
      `${craPath} cra --example=${testRepo}@master --no-install`
    );
    expect(fileExists('cra/package.json')).toBeTruthy();

    expect(directoryExists('cra/src')).toBeTruthy();
    expect(fileExists('cra/src/index.js')).toBeTruthy(0);

    expect(output.code).toBe(0);
  });

  it('should create app from github example in subdir', () => {
    util.setupStage(stageName);
    const output = shell.exec(
      `${craPath} cra --example=${testRepo}:subexample --no-install`
    );
    expect(fileExists('cra/package.json')).toBeTruthy();

    expect(directoryExists('cra/src')).toBeTruthy();
    expect(fileExists('cra/src/index.js')).toBeTruthy(0);

    expect(output.code).toBe(0);
  });

  it('should create app from git example', () => {
    util.setupStage(stageName);
    const output = shell.exec(
      `${craPath} cra --example=git+${testRepo}.git --no-install`
    );
    expect(fileExists('cra/package.json')).toBeTruthy();

    expect(directoryExists('cra/src')).toBeTruthy();
    expect(fileExists('cra/src/index.js')).toBeTruthy(0);

    expect(output.code).toBe(0);
  });

  it('should create app from git example at branch', () => {
    util.setupStage(stageName);
    const output = shell.exec(
      `${craPath} cra --example=git+${testRepo}.git@master --no-install`
    );
    expect(fileExists('cra/package.json')).toBeTruthy();

    expect(directoryExists('cra/src')).toBeTruthy();
    expect(fileExists('cra/src/index.js')).toBeTruthy(0);

    expect(output.code).toBe(0);
  });

  it('should create app from git example in subdir', () => {
    util.setupStage(stageName);
    const output = shell.exec(
      `${craPath} cra --example=git+${testRepo}.git:subexample --no-install`
    );
    expect(fileExists('cra/package.json')).toBeTruthy();

    expect(directoryExists('cra/src')).toBeTruthy();
    expect(fileExists('cra/src/index.js')).toBeTruthy(0);

    expect(output.code).toBe(0);
  });

    it('should create app from file example', () => {
      util.setupStage(stageName);
      const output = shell.exec(
        `${craPath} cra --example=file:../examples/basic --no-install`
      );
      expect(fileExists('cra/package.json')).toBeTruthy();

      expect(directoryExists('cra/src')).toBeTruthy();
      expect(fileExists('cra/src/index.js')).toBeTruthy(0);

      expect(output.code).toBe(0);
    });

  it('should exit with an error code when no project name is supplied', () => {
    util.setupStage(stageName);
    const output = shell.exec(
      `${path.join(craPath)}`, {
      silent: true,
    });

    expect(output.code).toBe(1);
  });

  afterEach(() => {
    util.teardownStage(stageName);
  });
});
