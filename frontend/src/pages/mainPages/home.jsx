import { useEffect, useState } from "react";
import { EventCard } from '@/components/components';
import api from "@/services/apiCall";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api('events?days=200&status=Approved&limit=10').then(result => {
            if (result.success) setEvents(result.events);
            else console.error(result.error);
        }).finally(() => setLoading(false));
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
                <button type="button" onClick={() => navigate("event/calendar")} className="moreEvents">More Events</button>
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
                <p>
                    We are the Theta-Omicron Chapter of Kappa Sigma at Muskingum University in New Concord, Ohio.
                    Our Chapter was founded in 1966 and has been going strong ever since. We are a Brotherhood of
                    men dedicated to Scholarship, Leadership, Fellowship, and Service.
                </p>
            </div>
        </div>
    );
};

export default Home;
