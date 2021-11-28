import fs from 'fs-extra';

export default function setupEnvironment({dotenv}) {
    const NODE_ENV = process.env.NODE_ENV;
    if (!NODE_ENV) {
      throw new Error(
        'The NODE_ENV environment variable is required but was not specified.'
      );
    }
  
    // https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
    const dotenvFiles = [
      `${dotenv}.${NODE_ENV}.local`,
      `${dotenv}.${NODE_ENV}`,
      NODE_ENV !== 'test' && `${dotenv}.local`,
      dotenv,
    ].filter(Boolean);
    // Load environment variables from .env* files. Suppress warnings using silent
    // if this file is missing. dotenv will never modify any environment variables
    // that have already been set. Variable expansion is supported in .env files.
    // https://github.com/motdotla/dotenv
    // https://github.com/motdotla/dotenv-expand
    dotenvFiles.forEach(dotenvFile => {
      if (fs.existsSync(dotenvFile)) {
        require('dotenv-expand')(
          require('dotenv').config({
            path: dotenvFile,
          })
        );
      }
    });
  }