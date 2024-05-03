import {useState} from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import './cssFiles/styles.css';


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
    return (!authenticated) ?  <Navigate to="/portal/login" state={{from: location}} replace={true} /> : children;
}

const PortalLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Check if user is already logged in and redirect them accordingly.
    
    
    

    return (
        <div className='loginContainer'>
            {/* <img
            src="/images/thetaOmicronLogo.jpeg"
            alt='Kappa Sigma - Theta-Omicron'
            className="loginLogo"
            /> */}

            <div className='loginForm'>
                <div>
                    <p>Username:</p>
                    <input
                    type='text'
                    placeholder='Username...'
                    value={email}
                    onChange={e=>setEmail(e.target.value)}
                    />
                </div>
                <br/>
                <div>
                    <p>Password:</p>
                    <input 
                    type='password'
                    placeholder='Password...'
                    value={password}
                    onChange={e=>setPassword(e.target.value)}
                    />
                </div>
                {/* <button onClick={()=>handleSubmit()}>Login</button> */}
            </div>

        </div>
    );
}



export {Auth,PortalLogin};