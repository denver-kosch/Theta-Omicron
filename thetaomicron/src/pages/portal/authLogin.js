import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';


const Auth = ({children}) => {
    const location = useLocation();
    const authenticated = /* logic to check if the user is authenticated */;

        // Redirect them to the login page, but save the current location they were trying to go to if not authenticated
        return (!authenticated) ?  <Navigate to="/portal/login" state={{ from: location }} replace /> : children;
}