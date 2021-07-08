import React from 'react';
import logo from '../../react.svg';
import { Link } from 'react-router-dom';
/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import styled from '@emotion/styled';

const Root = styled.div`
  .top-bar {
    display: flex;
    .left {
      flex: 1;
      display: flex;
      img {
        width: 64px;
        margin-right: 1rem;
      }
    }
    .right {
      flex: 0;
      list-style: none;
      display: inline-flex;
      margin: 2rem auto;
      li {
        margin: 0 1rem;
      }
    }
  }
`;

export const Header = () => (
  <Root>
    <div className="top-bar">
      <div className="left">
        <img src={logo} className="Home-logo" alt="logo" />
        <h1>Razzle</h1>
      </div>
      <ul className="right">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/green">Green</Link>
        </li>
      </ul>
    </div>
  </Root>
);
