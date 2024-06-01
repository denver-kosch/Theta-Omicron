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
            const {_id, name, description, time, location, imageUrl} = event;

            const FormatTime = ({date1, date2}) => {
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
                <Link to={`/event/${_id}`} key={_id}>
                    <div className="eventCard">
                        <img src={imageUrl || `${process.env.REACT_APP_API_URL}/images/events/default.png`} alt={name}/>
                        <div>
                            <p style={{fontWeight: 'bold'}}>{name}</p>
                            <FormatTime date1={new Date(time.start)} date2={new Date(time.end)}/>
                            <div className="location">
                                <img src='/images/locPin.png' alt="pin"/>
                                <p>{location}</p>
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
