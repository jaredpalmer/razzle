# Razzle TypeScript Example

## How to use
Download the example [or clone the whole project](https://github.com/jaredpalmer/razzle.git):

```bash
curl https://codeload.github.com/jaredpalmer/razzle/tar.gz/master | tar -xz --strip=2 razzle-master/examples/with-typescript
cd with-typescript
```

Install it and run:

```bash
yarn install
yarn start
```

## Idea behind the example
This is an of how to use Razzle with [TypeScript](https://github.com/Microsoft/TypeScript).

Basic razzle will uses Babel to transform TypeScript to plain JavaScript ( with babel-loader ), and uses TypeScript for type-checking.
Razzle knows how to resolve `.ts` and `.tsx` files out of box,

Lastly, we also need to modify our Jest configuration to handle typescript files.
Thus we add `ts-jest` and `@types/jest` to our dev dependencies. Then we augment Razzle's default jest setup by adding a field in our `package.json`.

```json
// package.json

{
  ...
  "jest": {
    "transform": {
      "\\.(ts|tsx)$": "<rootDir>/node_modules/ts-jest/preprocessor.js",
      "\\.css$": "<rootDir>/node_modules/razzle/config/jest/cssTransform.js",
      "^(?!.*\\.(js|jsx|css|json)$)": "<rootDir>/node_modules/razzle/config/jest/fileTransform.js"
    },
    "testMatch": [
      "<rootDir>/src/**/__tests__/**/*.(ts|js)?(x)",
      "<rootDir>/src/**/?(*.)(spec|test).(ts|js)?(x)"
    ],
    "moduleFileExtensions": [
      "ts",
      "tsx",
      "js",
      "json"
    ],
    "collectCoverageFrom": [
      "src/**/*.{js,jsx,ts,tsx}"
    ]
  }
}
```
