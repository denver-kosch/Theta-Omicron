import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiCall } from "../../components/apiCall";

const Home = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        getEvents();
    }, []);

    const getEvents = async () => {
        const get = await apiCall('getEvents', {days: 200});
        if (get.success) setEvents(get.events);
        else console.error(get.error);
    };


    const EventPanel = () => {
        const eventCard = event => {
            const {eventId, name, description, start, end, location} = event;
            
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
                console.log("formatted date: ", (formatted1))
                console.log("unformatted date: ", new Date(formatted1))
                const [datePart1, timePart1] = formatted1.split(", ");
                const [datePart2, timePart2] = formatted2.split(", ");
                if (datePart1 === datePart2)
                    return <p>{datePart1}<br/>{`${timePart1} - ${timePart2}`}</p>;
                
                return <p>{`${datePart1} ${timePart1} - ${datePart2} ${timePart2}`}</p>;
            };

            return (
                <Link to={`/event/${eventId}`} key={eventId}>
                    <div className="eventCard">
                        <img src="/images/crestC.png" alt={name}/>
                        <div>
                            <p style={{fontWeight: 'bold'}}>{name}</p>
                            <FormatDates date1={new Date(start)} date2={new Date(end)}/>
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
                {events.length === 0 && <div>Loading...</div>}
                {events.length !== 0 && events.map(event => eventCard(event))}
            </div>
    )};

    return (
        <>
            <div className="main">
                <h1>KAPPA SIGMA<br/>THETA-OMICRON CHAPTER</h1>
            </div>
            <EventPanel/>
        </>
)}

export default Home;
