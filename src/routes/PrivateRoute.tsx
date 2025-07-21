import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element:Component, isAuthenticated}) => {
  return isAuthenticated ? <Component  /> : <Navigate to="/login" />;
};

export default PrivateRoute;