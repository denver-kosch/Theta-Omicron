import { useEffect, useState } from "react";
import './styles.css';
import { apiCall } from "../../components/apiCall";


const PortalHome = () => {
    const [brother, setBro] = useState('');

    useEffect(() => {
        (async () => {
        const brotherInfo = await apiCall('getBro', {}, {'Authorization': `Bearer ${localStorage.getItem("token")}`});
        const bI = brotherInfo.info;
        console.log(bI);
        const title = (bI.status === 'Pledge') ? "Mr. " + bI.lastName : `Brother ` + bI.lastName;
        console.log(title);
        setBro(title);
        })();
    }, []); 

    return (
        <div className="homeContainer">
            {/* <img
            src="/images/thetaOmicronLogo.jpeg"
            alt='Kappa Sigma - Theta-Omicron'
            className="loginLogo"
            /> */}

            {brother === '' && <h2>Loading...</h2>}
            {brother !== '' && <h2>Welcome, {brother}</h2>}
        </div>
    )};

export default PortalHome;