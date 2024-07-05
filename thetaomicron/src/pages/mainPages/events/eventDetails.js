import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapView, EventCard } from "../../../components/components";
import { setKey as setGeocodeKey, fromAddress } from "react-geocode";
import apiCall from "../../../services/apiCall";


const Event = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [similars, setSimilars] = useState([]);
    //default value is lakeside 115
    const [lat, setLat] = useState(39.99832093770602);
    const [lng, setLng] = useState(-81.73459124217224);

    useEffect(() => {
        const fetchEventDetails = async () => {
            const result = await apiCall(`getEventDetails`, {id});
            if (result && result.success) {
                setEvent(result.event);
                setSimilars(result.similar);
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
    
    const FormatDates = ({date1, date2}) => {
        const options = {
          month: "numeric",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        };
        const formatted1  = date1.toLocaleString("en-US", options);
        const formatted2  = date2.toLocaleString("en-US", options);
        const [datePart1, timePart1] = formatted1.split(", ");
        const [datePart2, timePart2] = formatted2.split(", ");
        if (datePart1 === datePart2)
            return <h3>{datePart1} {`${timePart1} - ${timePart2}`}</h3>;
        
        return <h3>{`${datePart1} ${timePart1} - ${datePart2} ${timePart2}`}</h3>;
    };


    return (
        <>{loading ? <div className="loader">Loading...</div> :
        <div className="event">
            
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
                    {similars.map(event => <EventCard key={event._id} event={event} />)}
                </div>
            </div>
        </div>
        }</>
)};

export default Event;