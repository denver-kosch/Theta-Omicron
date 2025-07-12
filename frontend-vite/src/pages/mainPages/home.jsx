import { useEffect, useState } from "react";
import { EventCard } from '@/components/components';
import api from "@/services/apiCall";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getEvents = async () => {
            api('getEvents', { method: 'POST', body: { days: 200, status: "Approved" }, headers: { 'Content-Type': 'application/json' } })
            .then(events => {
                if (events.success) setEvents(events.events);
                else console.error(events.error);
                setLoading(false);
            });
        };
        getEvents();
        console.log("Home page loaded");
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
    )};

    return (
        <div className="main">
            <h1>KAPPA SIGMA<br/>THETA-OMICRON CHAPTER</h1>
            <div className="right">
                <EventPanel/>
            </div>
            <div className="center">
                <h2>WELCOME TO OUR WEBSITE</h2>
                <p>We are the Theta-Omicron chapter of Kappa Sigma at Muskingum University in New Concord, Ohio.
                    Our chapter was founded in 1966 and has been going strong ever since. We are a brotherhood of
                    men dedicated to scholarship, leadership, and service.</p>
            </div>
        </div>
    );
};

export default Home;
