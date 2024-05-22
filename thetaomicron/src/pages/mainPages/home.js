import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiCall } from "../../components/apiCall";

const Home = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const get = apiCall('getEvents', {days: 14});
        if (get.success) setEvents(get.events);
        else console.error(get.error);
    },[]);

    const EventPanel = () => {
        
        const EventCard = event => {
            const {eventId, name, description, start, end, location, type} = event;
            return (
                <div className="eventCard">
                    <Link to={`/event/${eventId}`}>

                    </Link>
                </div>
        )};

        return (
            <div className="eventPanel">

            </div>
    )};

    return (
        <>
            Hello
        </>
)}

export default Home;
