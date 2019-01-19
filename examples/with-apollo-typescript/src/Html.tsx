import React from 'react';
function Html({
  content,
  state,
  assets
}: {
  content: string;
  state: any;
  assets: any;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Razzle TypeScript</title>

        {assets.client.css ? (
          <link rel="stylesheet" href={assets.client.css} />
        ) : (
          ''
        )}
        {process.env.NODE_ENV === 'production' ? (
          <script src={assets.client.js} defer={true} />
        ) : (
          <script src={assets.client.js} defer={true} crossOrigin="anonymous" />
        )}
      </head>
      <body>
        <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__APOLLO_STATE__=${JSON.stringify(state).replace(
              /</g,
              '\\u003c'
            )};`
          }}
        />
      </body>
    </html>
  );
}

export default Html;
