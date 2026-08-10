import { useEffect, useMemo, useState } from "react";
import api from "@/services/apiCall";
import BrothersGrid from "@/components/cardGrid";

const Directory = () => {
    const [brothers, setBrothers] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [criteria, setCriteria] = useState("");

    useEffect(() => {
    const getBrothers = async () => {
        const response = await api("brothers");
        setIsLoading(false);
        if (response?.success) setBrothers(response.bros);
        else setError("Could not load directory at this time");
    };
    getBrothers();
    }, []);
    const filtered = useMemo(() => {
        const query = criteria.trim().toLowerCase();
        if (!query) return brothers;
        return brothers.filter(({firstName, lastName, positions = []}) => firstName.toLowerCase().includes(query) || lastName.toLowerCase().includes(query) || positions.some(position => position.toLowerCase().includes(query)));
    }, [criteria, brothers]);

    return (
    <div className="directoryContainer">
        <div className="topBar">
        <div>
            <h1>BROTHERS DIRECTORY:</h1>
        </div>
        <div>
            <input
            type="text"
            placeholder="Search..."
            value={criteria}
            onChange={(e) => setCriteria(e.target.value)}
            />
        </div>
        </div>

        <br/>

        {isLoading ? <h3>Loading...</h3> : (
        <table className="directory">
            <BrothersGrid brothers={filtered}/>
        </table>
        )}
        {(!isLoading && error !== '') && <h4 style={{color: 'red'}}>{error}</h4>}
    </div>
    );
}

export default Directory;
