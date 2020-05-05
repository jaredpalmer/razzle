---
id: css_modules
title: CSS Modules

---

Razzle supports [CSS Modules](https://github.com/css-modules/css-modules) using Webpack's [css-loader](https://github.com/webpack-contrib/css-loader). Simply import your CSS file with the extension `.module.css` and Razzle will process the file using `css-loader`.

```jsx
import React from 'react';
import styles from './style.module.css';

const Component = () => <div className={styles.className} />;

export default Component;
```
