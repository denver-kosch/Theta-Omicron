import { useEffect, useState } from "react";
import apiCall from "../../../services/apiCall";
import CommitteePosition from './positions/committeesMap';

const CommitteePage = () => {
    const [positions, setPositions] = useState([]);

    useEffect(() => {
        const getPositions = async () => {
            const response = await apiCall("getPositions", {}, {'Authorization': `Bearer ${localStorage.getItem("token")}`});
            if (response.success) setPositions(response.positions);
            else console.error(response.error);
        };
        getPositions();
    }, []);


    return (
        <div className='committeeCentral'>
            <h1>Committee Page</h1>
            <div className='committeeList'>
                {positions.map((committee, idx) => <CommitteePosition key={idx} position={committee}/>)}
            </div>
        </div>
    );
};

export default CommitteePage;