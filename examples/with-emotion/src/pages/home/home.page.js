import React from 'react';
import logo from '../../react.svg';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { Header } from '../../components/header';

const Blue = styled.h3`
  color: blue;
`;

export const HomePage = () => {
  return (
    <div>
      <p>
        To get started, edit <code>src/App.js</code> or <code>src/Home.js</code>{' '}
        and save to reload.
      </p>
      <div>
        <Blue>Hello, I am Blue</Blue>
      </div>
    </div>
  );
};
