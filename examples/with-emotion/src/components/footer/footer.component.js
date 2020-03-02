import React from 'react';

/** @jsx jsx */
import { jsx, css } from '@emotion/react';

export const Footer = () => (
  <div style={{ margin: 'auto', display: 'flex', justifyContent: 'center' }}>
    <ul
      css={css`
        list-style: none;
        display: inline-flex;
        margin: auto;
        padding: 0;
        li {
          margin-right: 1rem;
        }
      `}
    >
      <li>
        <a href="https://github.com/jaredpalmer/razzle">Docs</a>
      </li>
      <li>
        <a href="https://github.com/jaredpalmer/razzle/issues">Issues</a>
      </li>
      <li>
        <a href="https://palmer.chat">Community Slack</a>
      </li>
    </ul>
  </div>
);
