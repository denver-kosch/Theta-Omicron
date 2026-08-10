import { Link } from "react-router-dom";

export const EventCard = ({event, loggedIn}) => {
	const {_id, name, description, time, location, imageUrl} = event;

	const formatTime = (date1, date2) => {
		const options = {
		    month: "numeric",
		    day: "numeric",
		    year: "numeric",
		    hour: "numeric",
		    minute: "numeric",
		    hour12: true,
		};
		const formatted1    = date1.toLocaleString("en-US", options);
		const formatted2    = date2.toLocaleString("en-US", options);
		const [datePart1, timePart1] = formatted1.split(", ");
		const [datePart2, timePart2] = formatted2.split(", ");
		return datePart1 === datePart2 ? `${datePart1} ${timePart1} - ${timePart2}` : `${datePart1} ${timePart1} - ${datePart2} ${timePart2}`;
	};

	return (
		<Link to={loggedIn ? `/portal/event/${_id}` :`/event/${_id}`} key={_id}>
			<div className="eventCard easyLink">
				<img src={imageUrl || `${import.meta.env.VITE_API_URL}/images/events/default.png`} alt={name}/>
				<div>
					<p style={{fontWeight: 'bold'}} className="name">{name}</p>
					<p className="time">{formatTime(new Date(time.start), new Date(time.end))}</p>
					{location && <div className="location">
						<img src='/images/locPin.png' alt="pin" className="locPin"/>
						<p>{location}</p>
					</div>}
					{description && <p className="description">{description}</p>}
				</div>
			</div>
		</Link>
)};
