import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { EventCard } from "@/components/components";
import api from "@/services/apiCall";
import { fDate } from "@/services/dateFormatting";
import type { DateRangeProps, EventType, PortalEventDetails } from "@/types";

const FormatDates = ({date1, date2}: DateRangeProps) => {
    const [datePart1, timePart1] = fDate(date1).split(", ");
    const [datePart2, timePart2] = fDate(date2).split(", ");
    return datePart1 === datePart2
        ? <h3>{datePart1} {`${timePart1} - ${timePart2}`}</h3>
        : <h3>{`${datePart1} ${timePart1} - ${datePart2} ${timePart2}`}</h3>;
};

const PortalEvent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {id} = useParams();
    const [event, setEvent] = useState<PortalEventDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isOfficer, setIsOfficer] = useState(false);
    const [isCommittee, setIsCommittee] = useState(false);
    const [rejectConfirmation, setRejectConfirmation] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [similarEvents, setSimilarEvents] = useState<EventType[]>([]);
    const headers = useMemo(() => ({Authorization: `Bearer ${localStorage.getItem("token")}`}), []);

    useEffect(() => {
        const fetchEventDetails = async () => {
            if (!id) {
                setError("No event was selected.");
                setLoading(false);
                return;
            }
            const result = await api<{
                event: PortalEventDetails;
                similar: EventType[];
                isCommittee: boolean;
                isOfficer: boolean;
            }>(`events/${id}?portal=true`, {headers});
            if (result.success) {
                setEvent(result.event);
                setSimilarEvents(result.similar);
                setIsCommittee(result.isCommittee);
                setIsOfficer(result.isOfficer);
            } else {
                setError(result.error);
            }
            setLoading(false);
        };

        void fetchEventDetails();
    }, [headers, id]);

    const handleCommitteeAction = async (action: "delete" | "update") => {
        if (!event || !id) return;
        if (action === "update") {
            navigate(`${location.pathname}/edit`);
            return;
        }
        const response = await api(`events/${id}`, {
            method: "DELETE",
            body: {committeeId: event.committee.id},
            headers,
        });
        if (response.success) navigate("/portal/event");
        else console.error(response.error);
    };

    const handlePendingAction = async (action: "approve" | "reject") => {
        if (!event || !id) return;
        const response = await api(`events/${id}/${action}`, {
            method: "PUT",
            body: {
                committeeId: event.committee.id,
                ...(action === "reject" ? {reason: rejectionReason} : {}),
            },
            headers,
        });
        if (!response.success) console.error(response.error);
        else navigate(0);
    };

    if (loading) return <div className="loader">Loading...</div>;
    if (!event) return <p className="error">{error || "Event details could not be loaded."}</p>;

    return (
        <div className="event">
            {(isOfficer || isCommittee) && event.status === "Rejected" && event.rejDetails && (
                <div className="reject banner">
                    <p>Rejected on {fDate(event.rejDetails.date)}: {event.rejDetails.reason}</p>
                    {isCommittee && <div className="rejOptions">
                        <button type="button" onClick={() => void handleCommitteeAction("update")}>Update</button>
                        <button type="button" onClick={() => void handleCommitteeAction("delete")}>Delete</button>
                    </div>}
                </div>
            )}
            {(isOfficer || isCommittee) && event.status === "Pending" && (
                <div className="pending banner">
                    {isOfficer ? <div className="rejOptions">
                        <button type="button" onClick={() => setRejectConfirmation(true)}>Reject</button>
                        <button type="button" onClick={() => void handlePendingAction("approve")}>Approve</button>
                    </div> : <p>Pending Officer Approval</p>}
                </div>
            )}
            <div className="title">
                <div className="head">
                    <h1 style={{marginRight: "2%"}}>{event.name}</h1>
                    <h5>({event.committee.type})</h5>
                </div>
                <div className="time"><FormatDates date1={new Date(event.time.start)} date2={new Date(event.time.end)}/></div>
            </div>
            <div className="poster"><img src={event.imageUrl} alt={event.name}/></div>
            <div className="event-details"><div className="description"><p>{event.description}</p></div></div>
            <div className="location"><h3>Location:</h3><p>{event.location.name}</p></div>
            <div className="similar">
                <h3>Similar Events</h3>
                <div className="similar-events">
                    {similarEvents.map(similar => <EventCard key={similar._id} event={similar} loggedIn/>)}
                </div>
            </div>
            {rejectConfirmation && (
                <div className="modal confirmRej">
                    <p>Reason:</p>
                    <input type="text" value={rejectionReason} onChange={change => setRejectionReason(change.target.value)}/>
                    <div className="rejOptions">
                        <button type="button" className="cancel" onClick={() => setRejectConfirmation(false)}>Cancel</button>
                        <button type="button" className="confirm" onClick={() => void handlePendingAction("reject")}>Reject</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PortalEvent;
