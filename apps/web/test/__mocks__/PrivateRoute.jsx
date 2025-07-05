import React from 'react';

const PrivateRoute = ({ children }) => {
  return <div data-testid="private-route">{children}</div>;
};

export default PrivateRoute; 