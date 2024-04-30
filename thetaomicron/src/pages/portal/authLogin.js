import {useState} from 'react';
import { Navigate, useLocation } from 'react-router-dom';


const Auth = ({children}) => {
    const location = useLocation();

    const authenticate = async () => {
        try{

        }catch(err){
            return false;
        }
    };
    const authenticated = authenticate();
    // Redirect them to the login page, but save the current location they were trying to go to if not authenticated
    return (!authenticated) ?  <Navigate to="/portal/login" state={{from: location}} replace /> : children;
}

const PortalLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Check if user is already logged in and redirect them accordingly.
    
    

    return (
        <div>

        </div>
    );
}



export {Auth,PortalLogin};