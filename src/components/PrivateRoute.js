import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const PrivateRoute = ({ element, ...rest }) => {
    const { currentUser } = useAuth();

    return currentUser ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
