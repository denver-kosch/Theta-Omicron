import { useEffect, useState, Suspense, lazy } from "react";
import apiCall from "../../../services/apiCall";
import { useNavigate } from "react-router-dom";
import { FaEye, FaLocationDot, FaPeopleGroup, FaSortUp, FaSortDown } from "react-icons/fa6";

export const AllEvents = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState(null);
    const [sortApprovedConfig, setApprovedSortConfig] = useState({ key: null, direction: 'ascending' });
    const [sortPastConfig, setPastSortConfig] = useState({ key: null, direction: 'ascending' });
    const [sortComConfig, setComSortConfig] = useState({ key: null, direction: 'ascending' });
    const [sortRejectedConfig, setRejectedSortConfig] = useState({ key: null, direction: 'ascending' });


    useEffect(() => {
        getEvents();
    }, []); 
    
    const getEvents = async () => {
        const res = await apiCall('getPortalEvents', {}, {'Authorization': `Bearer ${localStorage.getItem("token")}`});
        setEvents(res.events);
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

    const TableSegment = ({title, collection, status, sort}) => {
        const Events = lazy(() => import ('../../../components/tableElems'));

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
                                <th onClick={() => requestSort('start', collection)}>Start {sort.key === 'start' && getSortIcon('start', collection)}</th>
                                <th onClick={() => requestSort('end', collection)}>End {sort.key === 'end' && getSortIcon('end', collection)}</th>
                                <th onClick={() => requestSort('location', collection)}><FaLocationDot /> {sort.key === 'location' && getSortIcon('location', collection)}</th>
                                <th onClick={() => requestSort('visibility', collection)}><FaEye /> {sort.key === 'visibility' && getSortIcon('visibility', collection)}</th>
                                <th onClick={() => requestSort('committee', collection)}><FaPeopleGroup /> {sort.key !== 'committee' && getSortIcon('committee', collection)}</th>
                                <th onClick={() => requestSort('mandatory', collection)}>Mandatory? {sort.key === 'mandatory' && getSortIcon('mandatory', collection)}</th>
                                {status && <th onClick={() => requestSort('status', collection)}>Status {sort.key !== 'status' && getSortIcon('status', collection)}</th>}
                    </tr>
                </thead>
                <tbody>
                    <Suspense fallback={emptyRow(status ? 9 : 8)}>
                        <Events events={events} collection={collection} sort={sort} navigate={navigate} emptyRow={emptyRow} status={status}/>
                    </Suspense>
                </tbody>
                </table>
            </div>
            <br/><br/>
            </>
    )};
    
    return (
    <div>
        <button onClick={() => navigate('/portal/event/create')} style={{marginRight: 'auto'}}>Create Event</button>
        <TableSegment title='Upcoming Events' collection='approved' status={false} sort={sortApprovedConfig}/>
        <TableSegment title='Past Events' collection='past' status={false} sort={sortPastConfig}/>
        <TableSegment title='Committee Events' collection='comEvents' status={true} sort={sortComConfig}/>
        <TableSegment title='Rejected Committee Events' collection='rejEvents' status={true} sort={sortRejectedConfig}/>
    </div>
)};