import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiCall } from "../../components/apiCall";


const Event = () => {
    const { id } = useParams();
    // eslint-disable-next-line
    const [event, setEvent] = useState(null);
    // eslint-disable-next-line
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEventDetails = async () => {
            const result = await apiCall(`getEventDetails`, {id: id});
            if (result && result.success) {
                setEvent(result.event);
            }
            setLoading(false);
        };
        fetchEventDetails();
    }, [id]);
    return (
        <></>
)};

export default Event;