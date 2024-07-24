import { useEffect, useState } from "react";
import apiCall from "../../../services/apiCall";
import CommitteePosition from './positions/committeesMap';

const CommitteePage = () => {
    const [positions, setPositions] = useState([]);

    useEffect(() => {
        getPositions();
    }, []);

    const getPositions = async () => {
        const response = await apiCall("getPositions", {}, {'Authorization': `Bearer ${localStorage.getItem("token")}`});
        if (response.success) setPositions(response.positions);
        else console.error(response.error);
    };


    return (
        <div class='committeeCentral'>
            <h1>Committee Page</h1>
            <div class='committeeList'>
                {positions.map(committee => <CommitteePosition key={committee._id} position={committee}/>)}
            </div>
        </div>
    );
};

export default CommitteePage;