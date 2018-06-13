import React from 'react';
import { AfterRoot, AfterData } from '@jaredpalmer/after';
import ReactDOMServer from 'react-dom/server';

export default class Document extends React.Component {
  static async getInitialProps({ assets, data, renderPage }) {
    const page = await renderPage();
    return {
      assets,
      data,
      ...page,
    };
  }
  render() {
    const { helmet, assets, data, css, initialApolloState } = this.props;

    const htmlAttrs = helmet.htmlAttributes.toComponent();
    const bodyAttrs = helmet.bodyAttributes.toComponent();

    return (
      <html {...htmlAttrs}>
        <head>
          <style id="react-native-modality">{`{:focus {outline: none; }}`}</style>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta charSet="utf-8" />
          <title>Razzle</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {helmet.title.toComponent()}
          {helmet.meta.toComponent()}
          {helmet.link.toComponent()}
          {css}
        </head>
        <body {...bodyAttrs}>
          <AfterRoot />
          <AfterData data={data} />
          {process.env.NODE_ENV === 'production' ? (
            <script src={assets.client.js} defer />
          ) : (
            <script src={assets.client.js} defer crossOrigin="anonymous" />
          )}
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__APOLLO_STATE__=${JSON.stringify(
                initialApolloState
              ).replace(/</g, '\\u003c')};`,
            }}
          />
        </body>
      </html>
    );
  }
}
