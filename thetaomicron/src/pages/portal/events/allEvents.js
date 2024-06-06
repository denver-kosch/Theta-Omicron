import { useEffect, useState } from "react";
import { apiCall } from "../../../components";
import { useNavigate } from "react-router-dom";
import { FaEye, FaLocationDot, FaPeopleGroup, FaSortUp, FaSortDown } from "react-icons/fa6";

export const AllEvents = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [sortApprovedConfig, setApprovedSortConfig] = useState({ key: null, direction: 'ascending' });
    const [sortPastConfig, setPastSortConfig] = useState({ key: null, direction: 'ascending' });
    const [sortComConfig, setComSortConfig] = useState({ key: null, direction: 'ascending' });
    const [sortRejectedConfig, setRejectedSortConfig] = useState({ key: null, direction: 'ascending' });


    useEffect(() => {
        (async () => {
            const res = await apiCall('getPortalEvents', {}, {'Authorization': `Bearer ${localStorage.getItem("token")}`});
            setEvents(res.events);
            setLoading(false);
        })();
    }, []); 

    const sortedEvents = (eventsArray, table) => {
        let sortConfig;

        switch (table) {
            case 'approved':
                sortConfig = sortApprovedConfig;
                break;
            case 'past':
                sortConfig = sortPastConfig;
                break;
            case 'comEvents':
                sortConfig = sortComConfig;
                break;
            case 'rejEvents':
                sortConfig = sortRejectedConfig;
                break;
            default:
                return;
        }
        if (sortConfig.key) {
            return [...eventsArray].sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return eventsArray;
    };

    const requestSort = (key, table) => {
        let direction = 'ascending';
        let sortConfig;
        let setSortConfig;

        switch (table) {
            case 'approved':
                sortConfig = sortApprovedConfig;
                setSortConfig = setApprovedSortConfig;
                break;
            case 'past':
                sortConfig = sortPastConfig;
                setSortConfig = setPastSortConfig;
                break;
            case 'comEvents':
                sortConfig = sortComConfig;
                setSortConfig = setComSortConfig;
                break;
            case 'rejEvents':
                sortConfig = sortRejectedConfig;
                setSortConfig = setRejectedSortConfig;
                break;
            default:
                return;
        }

        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
            key = null;
        }
        setSortConfig({ key, direction });
    };

    const emptyRow = num => {
        return(
            <tr className="no-hover">
                <td colSpan={num}>No Events Here</td>
            </tr>
    )};

    const row = event => {
        const {_id, name, description, start, end, location, visibility, committee, mandatory, status} = event;
        
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
            <td className="start">{new Date(start).toLocaleString('en-US', options)}</td>
            <td className="end">{new Date(end).toLocaleString('en-US', options)}</td>
            <td className="location">{location}</td>
            <td className="vis">{visibility}</td>
            <td className="com">{committee}</td>
            <td className="mandatory">{mandatory}</td>
            {status && <td className="status" style={statusStyle(status)}>{status}</td>}
        </tr>
    )};

    const getSortIcon = (key, table) => {
        const EmptyIcon = () => <div style={{ width: '1em', height: '1em', display: 'inline-block' }} />;

        let sortConfig;
        switch (table) {
            case 'approved':
                sortConfig = sortApprovedConfig;
                break;
            case 'past':
                sortConfig = sortPastConfig;
                break;
            case 'comEvents':
                sortConfig = sortComConfig;
                break;
            case 'rejEvents':
                sortConfig = sortRejectedConfig;
                break;
            default:
                return;
        }
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />;
        }
        return <EmptyIcon/>;
    };

    const tableSegment = (title, collection, status) => {
        return (
            <>
            <div className='tableSegment'>
                <table className="pTable">
                <thead>
                    <tr>
                        <th colSpan={status ? 9 : 8} style={{textAlign: 'center'}}>{title}</th>
                    </tr>
                    <tr className="tableColumns">
                        <th onClick={() => requestSort('name', collection)}>Name {getSortIcon('name', collection)}</th>
                                <th style={{ width: '100%' }} onClick={() => requestSort('description', collection)}>Description {getSortIcon('description', collection)}</th>
                                <th onClick={() => requestSort('start', collection)}>Start {getSortIcon('start', collection)}</th>
                                <th onClick={() => requestSort('end', collection)}>End {getSortIcon('end', collection)}</th>
                                <th onClick={() => requestSort('location', collection)}><FaLocationDot /> {getSortIcon('location', collection)}</th>
                                <th onClick={() => requestSort('visibility', collection)}><FaEye /> {getSortIcon('visibility', collection)}</th>
                                <th onClick={() => requestSort('committee', collection)}><FaPeopleGroup /> {getSortIcon('committee', collection)}</th>
                                <th onClick={() => requestSort('mandatory', collection)}>Mandatory? {getSortIcon('mandatory', collection)}</th>
                                {status && <th onClick={() => requestSort('status', collection)}>Status {getSortIcon('status', collection)}</th>}
                    </tr>
                </thead>
                <tbody>
                {events[collection].length === 0 && emptyRow(status ? 9 : 8)}
                {sortedEvents(events[collection], collection).map(e => row(e))}
                </tbody>
                </table>
            </div>
            <br/><br/>
            </>
    )};
    
    return (
    isLoading ? <div className="loader">Loading...</div> :
    <>
        <button onClick={() => navigate('/portal/event/create')} style={{marginRight: 'auto'}}>Create Event</button>
        {tableSegment('Upcoming Events', 'approved', false)}
        {tableSegment('Past Events', 'past', false)}
        {tableSegment('Committee Events', 'comEvents', true)}
        {tableSegment('Rejected Committee Events', 'rejEvents', true)}
    </>
)};