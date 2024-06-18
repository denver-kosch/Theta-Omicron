import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {APIProvider, Map, AdvancedMarker as Marker} from '@vis.gl/react-google-maps';


export const MapView = ({c}) => {
    const googleApiKey = process.env.REACT_APP_GOOGLE_API_KEY;
    const [isWebGLSupported, setIsWebGLSupported] = useState(true);

    useEffect(() => {
        const checkWebGL = () => {
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                if (gl && gl instanceof WebGLRenderingContext) {
                    console.log('WebGL is supported');
                    setIsWebGLSupported(true);
                } else {
                    console.error('WebGL is not supported');
                    setIsWebGLSupported(false);
                }
            } catch (e) {
                console.error('Error checking WebGL support:', e);
                setIsWebGLSupported(false);
            }
        };

        checkWebGL();
    }, []);

    if (!isWebGLSupported) {
        return <div>WebGL is not supported on your browser or hardware.</div>;
    }
    
    return (
        <APIProvider apiKey={googleApiKey}>
            <Map
            className='map'
            center={c}
            defaultZoom={17}
            gestureHandling={'none'}
            disableDefaultUI={true}
            clickableIcons={false}
            keyboardShortcuts={false}
            mapTypeId='hybrid'
            mapId='5e59c9f6171b1254'
            onError={(error) => console.error('Map error:', error)}
            >
                <Marker position={c}/>
            </Map>
        </APIProvider>
    )
};

export const EventCard = ({event, loggedIn}) => {
    const {_id, name, description, time, location, imageUrl} = event;

    const FormatTime = ({date1, date2}) => {
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
        return (datePart1 === datePart2) ?
             <p className="time">{datePart1} {`${timePart1} - ${timePart2}`}</p>:
             <p className="time">{`${datePart1} ${timePart1} - `}<br/>{`${datePart2} ${timePart2}`}</p>;
    };

    return (
        <Link to={loggedIn ? `/portal/event/${_id}` :`/event/${_id}`} key={_id}>
            <div className="eventCard easyLink">
                <img src={imageUrl || `${process.env.REACT_APP_API_URL}/images/events/default.png`} alt={name}/>
                <div>
                    <p style={{fontWeight: 'bold'}} className="name">{name}</p>
                    <FormatTime date1={new Date(time.start)} date2={new Date(time.end)}/>
                    {location && <div className="location">
                        <img src='/images/locPin.png' alt="pin" className="locPin"/>
                        <p>{location}</p>
                    </div>}
                    {description && <p className="description">{description}</p>}
                </div>
            </div>
        </Link>
)};