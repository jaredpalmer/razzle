import { Block, InlineBlock } from 'jsxstyle';
import React, { Component } from 'react';

class About extends Component {
  render() {
    return (
      <Block textAlign="center">
        <Block margin="4rem auto">
          <Block>
            To get started, edit <code>src/App.js</code> or{' '}
            <code>src/About.js</code> and save to reload.
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

export default About;
