import { useEffect, useState } from "react";
import apiCall from "../../../services/apiCall";


const Leadership = () => {
    const [leadership, setLeadership] = useState([]);
    const [ec, setEC] = useState([]);

    useEffect(() => {
        const fetchLeaders = async () => {
            const res = await apiCall('getChairmen');
            if (res.success) setLeadership(res.chairmen);

            const ec = await apiCall("getCommittee", {name: "Executive Committee", pics: true});
            if (ec.success) setEC(ec.members);
        };
        fetchLeaders();
    },[]);

    

    return (
        <>
        <p>Hello</p>
        </>
)}

export default Leadership;