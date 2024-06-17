import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapView } from "../../../components/components";
import apiCall from "../../../services/apiCall";
import { setKey as setGeocodeKey, fromAddress } from "react-geocode";

const EditEvent = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    // eslint-disable-next-line
    const [name, setName] = useState('');
    // eslint-disable-next-line
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line
    const [locOptions, setLocOptions] = useState([]);
    // eslint-disable-next-line
    const [commOptions, setCommOptions] = useState([]);
    // eslint-disable-next-line
    const [officerComms, setOfficerComms] = useState([]);
    // eslint-disable-next-line
    const [location, setLocation] = useState({});
    // eslint-disable-next-line
    const [newLocName, setNewLocName] = useState('');
    // eslint-disable-next-line
    const [newLocAddress, setNewLocAddress] = useState('');
    // eslint-disable-next-line
    const [start, setStart] = useState('');
    // eslint-disable-next-line
    const [end, setEnd] = useState('');
    // eslint-disable-next-line
    const [image, setImage] = useState(null);
    // eslint-disable-next-line
    const [commId, setCommId] = useState('');
    // eslint-disable-next-line
    const [type, setType] = useState('');
    // eslint-disable-next-line
    const [visibility, setVisibility] = useState('');
    //default value is lakeside 115
    const [lat, setLat] = useState(39.99832093770602);
    const [lng, setLng] = useState(-81.73459124217224);

    useEffect(() => {
        const fetchEventDetails = async () => {
            const result = await apiCall(`getEventDetails`, {id, loggedIn: true});
            if (result && result.success) {
                setEvent(result.event);
            }
            else console.log(result);
            
            setGeocodeKey(process.env.REACT_APP_GEO_API_KEY);
            fromAddress(`${result.event.location.address}, ${result.event.location.city}, ${result.event.location.state} ${result.event.location.zip}`)
            .then(({ results }) => {
                const { lat, lng } = results[0].geometry.location;
                setLat(lat);
                setLng(lng);
            }).catch(console.error);

            setLoading(false);
        };
        fetchEventDetails();
    }, [id]);

    useEffect(() => {
        const changeLatLng = address => {
            fromAddress(`${address.address}, ${address.city}, ${address.state} ${address.zip}`)
                .then(({ results }) => {
                    const { lat, lng } = results[0].geometry.location;
                    setLat(lat);
                    setLng(lng);
                }).catch(console.error);
        };
        changeLatLng(newLocAddress);
    }, [newLocAddress]);

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
        const [datePart1, timePart1] = formatted1.split(", ");
        const [datePart2, timePart2] = formatted2.split(", ");
        if (datePart1 === datePart2)
            return <h3>{datePart1} {`${timePart1} - ${timePart2}`}</h3>;
        
        return <h3>{`${datePart1} ${timePart1} - ${datePart2} ${timePart2}`}</h3>;
    };


    return (
        <>{loading ? <div className="loader">Loading...</div> :
        <div className="event">
            <div className="title">
                <div className="head">
                    <h1 style={{marginRight: '2%'}}>{name}</h1>
                    <h5>({type})</h5>
                </div>
                <div className="time">
                    <FormatDates date1={new Date(start)} date2={new Date(end)}/>
                </div>
            </div>
            <div className="poster">
                <img src={event.imageUrl} alt={name} />
            </div>
            <div className="event-details">
                <div className="description">
                    <p>{description}</p>
                </div>
            </div>
            <div className="location">
                <h3>Location:</h3>
                <MapView c={{lat, lng}}/>
            </div>
            <div className="similar">
                <h3>Similar Events</h3>
                <div className="similar-events">
                    
                </div>
            </div>
        </div>
        }</>
)};

export default EditEvent;