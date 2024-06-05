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

    const emptyRow = num => {
        return(
            <tr className="no-hover">
                <td colSpan={num}>No Events Here</td>
            </tr>
    )};

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
        const statusStyle = (status) => {
            return (status === "Pending") ? { backgroundColor: 'yellow', color: 'black' } : (status === "Rejected") ? { backgroundColor: 'red', color: 'black' } : {backgroundColor: '#1AFF00', color: 'black'};
        };
        
        return(
        <tr onClick={() => navigate(`/portal/event/${_id}`)} key={_id}>
            <td className="name">{name}</td>
            <td className="desc">{description}</td>
            <td className="start">{new Date(time.start).toLocaleString('en-US', options)}</td>
            <td className="end">{new Date(time.end).toLocaleString('en-US', options)}</td>
            <td className="location">{location}</td>
            <td className="vis">{visibility}</td>
            <td className="com">{committee}</td>
            <td className="mandatory">{mandatory}</td>
            {status && <td className="status" style={statusStyle(status)}>{status}</td>}
        </tr>
    )};

    const tableSegment = (title, collection, status) => {
        return (
            <>
            <div className='tableSegment'>
                <thead>
                    <tr>
                        <th colSpan={status ? 9 : 8} style={{textAlign: 'center'}}>{title}</th>
                    </tr>
                    <tr>
                        <th>Name</th>
                        <th style={{width: '100%'}}>Description</th>
                        <th>Start</th>
                        <th>End</th>
                        <th><FaLocationDot/></th>
                        <th><FaEye /></th>
                        <th><FaPeopleGroup/></th>
                        <th>Mandatory?</th>
                        {status && <th>Status</th>}
                    </tr>
                </thead>
                <tbody>
                {events[collection].length === 0 && emptyRow(status ? 9 : 8)}
                {events[collection].map(e => row(e))}
                </tbody>
            </div>
            <br/><br/>
            </>
    )};
    
    return (
    isLoading ? <div className="loader">Loading...</div> :
    <>
        <table className="pTable">
            {tableSegment('Upcoming Events', 'approved', false)}
            {tableSegment('Past Events', 'past', false)}
            {tableSegment('Committee Events', 'comEvents', true)}
            {tableSegment('Rejected Committee Events', 'rejEvents', true)}
        </table>
    </>
)};