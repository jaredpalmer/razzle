import { Block, InlineBlock } from 'jsxstyle';
import React, { Component } from 'react';

class Home extends Component {
  render() {
    return (
      <Block textAlign="center">
        <Block backgroundColor="#222">
          <Block fontSize="3rem" color="#fff" padding="6rem 0" fontWeight="800">
            Razzle x JSXStyle
          </Block>
        </Block>
        <Block margin="4rem auto">
          <Block>
            To get started, edit <code>src/App.js</code> or{' '}
            <code>src/Home.js</code> and save to reload.
          </Block>

          <Block component="ul" margin="2rem auto">
            <InlineBlock component="li" marginRight="1rem">
              <a href="https://github.com/jaredpalmer/razzle">Docs</a>
            </InlineBlock>
            <InlineBlock component="li" marginRight="1rem">
              <a href="https://github.com/jaredpalmer/razzle/issues">Issues</a>
            </InlineBlock>
            <InlineBlock component="li">
              <a href="https://palmer.chat">Community Slack</a>
            </InlineBlock>
          </Block>
        </Block>
      </Block>
    );
  }
}

export default Home;
