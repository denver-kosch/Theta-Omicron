import { useEffect, useState } from "react";
import apiCall from "../../services/apiCall";


const PortalHome = () => {
    const [brother, setBro] = useState('');

    useEffect(() => {
        (async () => {
            const brotherInfo = await apiCall('getBro', {}, {'Authorization': `Bearer ${sessionStorage.getItem("token")}`});
            const bI = brotherInfo?.info;
            if (!bI) return;
            const title = (bI.status === 'Pledge') ? "Mr. " + bI.lastName : `Brother ` + bI.lastName;
            setBro(title);
        })();
    }, []); 

    return (
        <>{brother === '' ? <h2>Loading...</h2> : <h2>Welcome, {brother}</h2>}</>
    )};

export default PortalHome;