import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { APIProvider, Map, AdvancedMarker as Marker } from "@vis.gl/react-google-maps";
import type { DateRangeProps, EventCardType, MapViewProps } from "@/types";

const FormatTime = ({date1, date2}: DateRangeProps) => {
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

	return datePart1 === datePart2
		? <p className="time">{datePart1} {`${timePart1} - ${timePart2}`}</p>
		: <p className="time">{`${datePart1} ${timePart1} - `}<br/>{`${datePart2} ${timePart2}`}</p>;
};

export const MapView = ({coordinates}: MapViewProps) => {
	const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;
	const [isWebGLSupported, setIsWebGLSupported] = useState(true);

	useEffect(() => {
		const canvas = document.createElement("canvas");
		const context = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		setIsWebGLSupported(context instanceof WebGLRenderingContext);
	}, []);

	if (!isWebGLSupported) return <div>WebGL is not supported on your browser or hardware.</div>;
	
	return (
		<APIProvider apiKey={googleApiKey}>
			<Map
				className="map"
				defaultCenter={coordinates}
				defaultZoom={17}
				gestureHandling="none"
				disableDefaultUI
				clickableIcons={false}
				keyboardShortcuts={false}
				mapTypeId="hybrid"
				mapId="5e59c9f6171b1254"
				onError={(error: unknown) => console.error("Map error:", error)}
			>
				<Marker position={coordinates}/>
			</Map>
		</APIProvider>
	);
};

export const EventCard = ({event, loggedIn}: EventCardType) => {
	const {_id, name, description, time, location, imageUrl} = event;

	return (
		<Link to={loggedIn ? `/portal/event/${_id}` : `/event/${_id}`}>
			<div className="eventCard easyLink">
				<img src={imageUrl || `${import.meta.env.VITE_API_URL}/images/events/default.png`} alt={name}/>
				<div>
					<p style={{fontWeight: "bold"}} className="name">{name}</p>
					<FormatTime date1={new Date(time.start)} date2={new Date(time.end)}/>
					{location && <div className="location">
						<img src="/images/locPin.png" alt="" className="locPin"/>
						<p>{location}</p>
					</div>}
					{description && <p className="description">{description}</p>}
				</div>
			</div>
		</Link>
	);
};
