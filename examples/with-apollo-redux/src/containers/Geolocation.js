import React from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';

import getLocationQuery from '../queries/getLocation.js';

import Geolocation from '../components/Geolocation';

const GeolocationContainer = props => <Geolocation {...props} />;

export default compose(connect(), graphql(getLocationQuery))(
  GeolocationContainer
);
