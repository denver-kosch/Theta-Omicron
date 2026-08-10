import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EventCard } from "@/components/components";
import api from "@/services/apiCall";
import type { ApiResponse, DateRangeProps, EventDetailsType, EventType } from "@/types";

const FormatDates = ({date1, date2}: DateRangeProps) => {
    const options = {
        month: "numeric",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    } satisfies Intl.DateTimeFormatOptions;
    const formatted1 = date1.toLocaleString("en-US", options);
    const formatted2 = date2.toLocaleString("en-US", options);
    const [datePart1, timePart1] = formatted1.split(", ");
    const [datePart2, timePart2] = formatted2.split(", ");
    if (datePart1 === datePart2) return <h3>{datePart1} {`${timePart1} - ${timePart2}`}</h3>;
    return <h3>{`${datePart1} ${timePart1} - ${datePart2} ${timePart2}`}</h3>;
};

const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState<EventDetailsType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [similars, setSimilars] = useState<EventType[]>([]);

    useEffect(() => {
        const fetchEventDetails = async () => {
            if (!id) {
                setError("No event was selected.");
                setLoading(false);
                return;
            }

            const result = await api(`events/${id}`) as ApiResponse<{ event: EventDetailsType; similar: EventType[]; }>;
            if (result.success) {
                setEvent(result.event);
                setSimilars(result.similar);
            } else setError(result.error);
            setLoading(false);
        };

        fetchEventDetails();
    }, [id]);

    if (loading) return <div className="loader">Loading...</div>;
    if (!event) return <p className="error">{error || "Event details could not be loaded."}</p>;

    return (
        <div className="event">
            <div className="title">
                <div className="head">
                    <h1 style={{marginRight: "2%"}}>{event.name}</h1>
                    <h5>({event.committee.type})</h5>
                </div>
                <div className="time">
                    <FormatDates date1={new Date(event.time.start)} date2={new Date(event.time.end)}/>
                </div>
            </div>
            <div className="poster">
                <img src={event.imageUrl} alt={event.name}/>
            </div>
            <div className="event-details">
                <div className="description">
                    <p>{event.description}</p>
                </div>
            </div>
            <div className="location">
                <h3>Location:</h3>
                <p>{event.location.name}</p>
            </div>
            <div className="similar">
                <h3>Similar Events</h3>
                <div className="similar-events">
                    {similars.map(similar => <EventCard key={similar._id} event={similar}/>)}
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
