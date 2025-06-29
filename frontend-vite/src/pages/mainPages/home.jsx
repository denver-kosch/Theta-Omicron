import { useEffect, useState } from "react";
import { EventCard } from '@/components/components';
import apiCall from "../../services/apiCall";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getEvents = async () => {
            const get = await apiCall('getEvents', {days: 200, status: 'Approved'});
            if (get.success) setEvents(get.events);
            else console.error(get.error);
            
            setLoading(false);
        };
        getEvents();
    }, []);

    const EventPanel = () => {

        return (
            <div className="eventPanel">
            <h2>Upcoming Events:</h2>
            <div className="eventCards">
                {loading ? <div>Loading...</div>
                 : events.length === 0 ? <div style={{ color: 'red' }}>No upcoming events!</div>
                 : events.map(event => (<EventCard key={event._id} event={event} />))
                }
            </div>
            <button onClick={() => navigate("event/calendar")}>More Events</button>
            </div>
        );};

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
