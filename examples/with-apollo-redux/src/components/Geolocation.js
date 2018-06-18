import React from 'react';

const Geolocation = ({ data: { error, loading, getLocation } }) => {
  if (error) {
    return <div>Error...</div>;
  } else if (loading) {
    return <div>Loading...</div>;
  } else {
    const { latitude, longitude } = getLocation.location;

    return <div>{`latitude: ${latitude}, longitude: ${longitude}`}</div>;
  }
};

export default Geolocation;
