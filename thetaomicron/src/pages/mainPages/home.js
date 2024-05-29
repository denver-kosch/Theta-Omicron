import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiCall } from '../../components';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getEvents = async () => {
            const get = await apiCall('getEvents', {days: 200, status: 'Approved'});
            if (get.success) {
                setEvents(get.events);
                console.log(get.events);
                setLoading(false);
            }
            else {
                console.error(get.error);
                setLoading(false);
            }
        };
        getEvents();
    }, []);

    const EventPanel = () => {
        const eventCard = event => {
            const {eventId, name, description, start, end, Location, imageUrl} = event;
            console.log(imageUrl);
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
                    return <p>{datePart1}<br/>{`${timePart1} - ${timePart2}`}</p>;
                
                return <p>{`${datePart1} ${timePart1} -`}<br/>{`${datePart2} ${timePart2}`}</p>;
            };

            return (
                <Link to={`/event/${eventId}`} key={eventId}>
                    <div className="eventCard">
                        <img src={imageUrl || `http://${process.env.REACT_APP_SERVERHOST}:${process.env.REACT_APP_SERVERPORT}/images/events/default.png`} alt={name}/>
                        <div>
                            <p style={{fontWeight: 'bold'}}>{name}</p>
                            <FormatDates date1={new Date(start)} date2={new Date(end)}/>
                            <div className="location">
                                <img src='/images/locPin.png' alt="pin"/>
                                <p>{Location.name}</p>
                            </div>
                            <p className="description">{description}</p>
                        </div>
                    </div>
                </Link>
        )};

        return (
            <div className="eventPanel">
                <h2>Upcoming Events:</h2>
                <div className="eventCards">
                    {loading && <div>Loading...</div>}
                    {(events.length === 0 && !loading) && <div style={{color: 'red'}}>No upcoming events!</div>}
                    {events.length !== 0 && events.map(event => eventCard(event))}
                </div>
            </div>
    )};

    return (
        <>
            <div className="main">
                <h1>KAPPA SIGMA<br/>THETA-OMICRON CHAPTER</h1>
                <div className="right">
                    <EventPanel/>
                </div>
            </div>
        </>
)}

export default Home;
