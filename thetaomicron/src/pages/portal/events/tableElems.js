
const sortedEvents = (table, sort) => {
    if (sort.key) {
        return [...table].sort((a, b) => {
            if (a[sort.key] < b[sort.key]) {
                return sort.direction === 'ascending' ? -1 : 1;
            }
            if (a[sort.key] > b[sort.key]) {
                return sort.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }
    return table;
};

const row = (event, navigate) => {
    const {_id, name, description, start, end, locationName, visibility, committeeName, mandatory, status} = event;
    
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
    console.log(locationName);
    
    return(
    <tr onClick={() => navigate(`/portal/event/${_id}`)} key={_id}>
        <td className="name">{name}</td>
        <td className="desc">{description}</td>
        <td className="start">{new Date(start).toLocaleString('en-US', options)}</td>
        <td className="end">{new Date(end).toLocaleString('en-US', options)}</td>
        <td className="location">{locationName}</td>
        <td className="vis">{visibility}</td>
        <td className="com">{committeeName}</td>
        <td className="mandatory">{mandatory}</td>
        {status && <td className="status" style={statusStyle(status)}>{status}</td>}
    </tr>
)};

const Events = ({events, collection, sort, navigate, emptyRow, status}) => {
    if (!events) return null;
    return (
        <>
        {events[collection].length === 0 && emptyRow(status ? 9 : 8)}
        {sortedEvents(events[collection], sort).map(e => row(e, navigate))}
        </>
    )
};


export default Events;