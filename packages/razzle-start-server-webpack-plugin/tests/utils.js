import fs from 'fs';
import path from 'path';
import expect from 'expect';

export function compareDirectory(actual, expected) {
  const files = fs.readdirSync(expected);

  for (const file of files) {
    const absoluteFilePath = path.resolve(expected, file);

    const stats = fs.lstatSync(absoluteFilePath);

    if (stats.isDirectory()) {
      compareDirectory(
        path.resolve(actual, file),
        path.resolve(expected, file)
      );
    } else if (stats.isFile()) {
      const content = fs.readFileSync(path.resolve(expected, file), 'utf8');
      const actualContent = fs.readFileSync(path.resolve(actual, file), 'utf8');

      expect(actualContent).toEqual(content);
    }
  }
}

export function compareWarning(actual, expectedFile) {
  if (!fs.existsSync(expectedFile)) {
    return;
  }

  // eslint-disable-next-line global-require, import/no-dynamic-require
  const expected = require(expectedFile);

  expect(actual.trim()).toBe(expected.trim());
}
