import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/services/apiCall";
import { fDate } from "@/services/dateFormatting";
import type { PortalEventDetails } from "@/types";

const EditEvent = () => {
    const {id} = useParams();
    const [event, setEvent] = useState<PortalEventDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const headers = useMemo(() => ({Authorization: `Bearer ${localStorage.getItem("token")}`}), []);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!id) {
                setError("No event was selected.");
                setLoading(false);
                return;
            }
            const response = await api<{event: PortalEventDetails}>(`events/${id}?portal=true`, {headers});
            if (response.success) setEvent(response.event);
            else setError(response.error);
            setLoading(false);
        };

        void fetchEvent();
    }, [headers, id]);

    if (loading) return <div className="loader">Loading...</div>;
    if (!event) return <p className="error">{error || "Event could not be loaded."}</p>;

    return (
        <div className="event">
            <div className="title">
                <div className="head">
                    <h1 style={{marginRight: "2%"}}>{event.name}</h1>
                    <h5>({event.committee.type})</h5>
                </div>
                <div className="time"><h3>{fDate(event.time.start)} – {fDate(event.time.end)}</h3></div>
            </div>
            <div className="poster"><img src={event.imageUrl} alt={event.name}/></div>
            <div className="event-details"><div className="description"><p>{event.description}</p></div></div>
            <div className="location"><h3>Location:</h3><p>{event.location.name}</p></div>
            <p>Event editing controls are still under development.</p>
        </div>
    );
};

export default EditEvent;
