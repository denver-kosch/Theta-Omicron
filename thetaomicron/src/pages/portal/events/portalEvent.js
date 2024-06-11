import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { apiCall, MapView, EventCard } from "../../../components";
import { setKey as setGeocodeKey, fromAddress } from "react-geocode";


const PortalEvent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOfficer, setIsOfficer] = useState(false);
    const [isCommittee, setIsCommittee] = useState(false);
    const [similars, setSimilars] = useState([]);
    //default value is lakeside 115
    const [lat, setLat] = useState(39.99832093770602);
    const [lng, setLng] = useState(-81.73459124217224);

    useEffect(() => {
        const fetchEventDetails = async () => {
            const result = await apiCall(`getEventDetails`, {id, loggedIn: true}, {'Authorization': `Bearer ${localStorage.getItem('token')}`});
            if (result && result.success) {
                setEvent(result.event);
                setSimilars(result.similar);
                setIsCommittee(result.isCommittee);
                setIsOfficer(result.isOfficer);
            }
            else console.log(result);
            
            setGeocodeKey(process.env.REACT_APP_GEO_API_KEY);
            fromAddress(`${result.event.location.address}, ${result.event.location.city}, ${result.event.location.state} ${result.event.location.zip}`)
            .then(({ results }) => {
                const { lat, lng } = results[0].geometry.location;
                setLat(lat);
                setLng(lng);
            }).catch(console.error);

            setLoading(false);
        };
        fetchEventDetails();
    }, [id]);

    const fDate = date => {
        const options = {
            month: "numeric",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        };
        return new Date(date).toLocaleString('en-US', options);
    };

    const FormatDates = ({date1, date2}) => {
        const formatted1  = fDate(date1);
        const formatted2  = fDate(date2);
        const [datePart1, timePart1] = formatted1.split(", ");
        const [datePart2, timePart2] = formatted2.split(", ");
        return (datePart1 === datePart2) ? 
            <h3>{datePart1} {`${timePart1} - ${timePart2}`}</h3> :
            <h3>{`${datePart1} ${timePart1} - ${datePart2} ${timePart2}`}</h3>;
    };

    const handleRej = async op => {
        if (op === 'del') {
            const res = await apiCall('rmEvent', {id}, {'Authorization': `Bearer ${localStorage.getItem('token')}`});
            if (!res.success) console.error(res.error);
            navigate('portal/event');
        }
        if (op === 'upd') navigate(`${location.pathname}/edit`);
    };

    return (
        <>{loading && <div className="loader">Loading...</div>}
        {!loading && <div className="event">
            {((isOfficer || isCommittee) && event.status === "Rejected") && <div className="rejectBanner">
                <p>Rejected on {fDate(event.rejDetails.date)}: {event.rejDetails.reason}</p>
                {isCommittee && <div className="rejOptions">
                    <button onClick={() => handleRej("upd")}>Update</button>
                    <button onClick={() => handleRej("del")}>Delete</button>
                </div>}
            </div>}
            {((isOfficer || isCommittee) && event.status === "Pending") && <div className="pendingBanner">
                Hello
            </div>}
            <div className="title">
                <div className="head">
                    <h1 style={{marginRight: '2%'}}>{event.name}</h1>
                    <h5>({event.committee.type})</h5>
                </div>
                <div className="time">
                    <FormatDates date1={new Date(event.time.start)} date2={new Date(event.time.end)}/>
                </div>
            </div>
            <div className="poster">
                <img src={event.imageUrl} alt={event.name} />
            </div>
            <div className="event-details">
                <div className="description">
                    <p>{event.description}</p>
                </div>
            </div>
            <div className="location">
                <h3>Location:</h3>
                <MapView c={{lat, lng}}/>
            </div>
            <div className="similar">
                <h3>Similar Events</h3>
                <div className="similar-events">
                    {similars.map(event => <EventCard key={event._id} event={event} loggedIn={true} />)}
                </div>
            </div>
        </div>
        }</>
)};

export default PortalEvent;

