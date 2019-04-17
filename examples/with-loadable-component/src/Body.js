import React from 'react';
import loadable from '@loadable/component';

const BodyPart = loadable(() =>
  import(/* webpackChunkName: "body-part" */ './BodyPart')
);

const Body = () => (
  <div>
    This is my Body <BodyPart />
  </div>
);

export default Body;
