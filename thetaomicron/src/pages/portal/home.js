import React from "react";
import './cssFiles/styles.css';


const PortalHome = () => {
    
    const logout = () => {
        localStorage.removeItem("token");
        window.location.reload(); 
    };


    return (
        <div className="homeContainer">
            {/* <img
            src="/images/thetaOmicronLogo.jpeg"
            alt='Kappa Sigma - Theta-Omicron'
            className="loginLogo"
            /> */}

            <button onClick={logout}>Log Out</button>
        </div>
    )};

export default PortalHome;