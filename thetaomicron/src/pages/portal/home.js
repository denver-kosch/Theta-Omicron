import { useEffect, useState } from "react";
import { apiCall } from "../../components/components";


const PortalHome = () => {
    const [brother, setBro] = useState('');

    useEffect(() => {
        (async () => {
            const brotherInfo = await apiCall('getBro', {}, {'Authorization': `Bearer ${localStorage.getItem("token")}`});
            const bI = brotherInfo.info;
            const title = (bI.status === 'Pledge') ? "Mr. " + bI.lastName : `Brother ` + bI.lastName;
            setBro(title);
        })();
    }, []); 

    return (
        <>
            {brother === '' && <h2>Loading...</h2>}
            {brother !== '' && <h2>Welcome, {brother}</h2>}
        </>
    )};

export default PortalHome;