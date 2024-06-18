import { useEffect, useState } from "react";
import apiCall from "../../../services/apiCall";


const Leadership = () => {
    const [leadership, setLeadership] = useState([]);

    useEffect(() => {
        const fetchLeaders = async () => {
            const res = await apiCall('getChairmen');
        };
    })

    return (
        <>
        <p>Hello</p>
        </>
)}

export default Leadership;