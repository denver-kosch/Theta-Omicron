import { useEffect, useState } from "react";
import { apiCall } from "../../../components";
import { useNavigate } from "react-router-dom";
import { FaEye, FaLocationDot, FaPeopleGroup } from "react-icons/fa6";

export const AllEvents = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const res = await apiCall('getPortalEvents', {}, {'Authorization': `Bearer ${localStorage.getItem("token")}`});
            setEvents(res.events);
            setLoading(false);
        })();
    }, []); 


    const row = event => {
        const {_id, name, description, time, location, visibility, committee, mandatory, status} = event;
        const options = {
            month: "numeric",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        };
        console.log(new Date(time.start).toLocaleString('en-US', options));
        return(
        <tr onClick={() => navigate(`/portal/event/${_id}`)}>
            <td>{name}</td>
            <td>{description}</td>
            <td>{new Date(time.start).toLocaleString('en-US', options)}</td>
            <td>{new Date(time.end).toLocaleString('en-US', options)}</td>
            <td>{location}</td>
            <td>{visibility}</td>
            <td>{committee}</td>
            {status && <td>{status}</td>}
            <td>{mandatory}</td>
        </tr>
    )};
    
    return (
    isLoading ? <div className="loader">Loading...</div> :
    <>
        
        <table className="pTable approved">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Start</th>
                    <th>End</th>
                    <th><FaLocationDot/></th>
                    <th><FaEye /></th>
                    <th><FaPeopleGroup/></th>
                    <th>Mandatory?</th>
                </tr>
            </thead>
            <tbody>
                {events.approved.map(e => row(e))}
            </tbody>
        </table>
        <br/>
        <table className="pTable past">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Start</th>
                    <th>End</th>
                    <th><FaLocationDot/></th>
                    <th><FaEye /></th>
                    <th><FaPeopleGroup/></th>
                    <th>Mandatory?</th>
                </tr>
            </thead>
            <tbody>
                {events.past.map(e => row(e))}
            </tbody>
        </table>
    <br/>
        <table className="pTable comEvents">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Start</th>
                    <th>End</th>
                    <th><FaLocationDot/></th>
                    <th><FaEye /></th>
                    <th><FaPeopleGroup /></th>
                    <th>Mandatory?</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
            {events.comEvents.map(e => row(e))}
            </tbody>
        </table>
    </>
)};