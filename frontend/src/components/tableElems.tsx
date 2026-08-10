import type { CSSProperties } from "react";
import type {
	EventStatus,
	EventTableProps,
	EventTableRow,
	EventTableRowProps,
	EventTableSort,
} from "@/types";

const DATE_OPTIONS = {
	month: "numeric",
	day: "numeric",
	year: "numeric",
	hour: "numeric",
	minute: "numeric",
	hour12: true,
} satisfies Intl.DateTimeFormatOptions;

const STATUS_STYLES: Record<EventStatus, CSSProperties> = {
	Pending: {backgroundColor: "yellow", color: "black"},
	Rejected: {backgroundColor: "red", color: "black"},
	Approved: {backgroundColor: "#1AFF00", color: "black"},
};

const sortedEvents = (events: EventTableRow[], sort: EventTableSort) => {
	const { key, direction } = sort;
	if (!key) return events;

	const directionMultiplier = direction === "ascending" ? 1 : -1;
	return [...events].sort((a, b) =>
		String(a[key] ?? "").localeCompare(String(b[key] ?? ""), undefined, {
			numeric: true,
			sensitivity: "base",
		}) * directionMultiplier
	);
};

const EventRow = ({event, navigate}: EventTableRowProps) => {
	const {_id, name, description, start, end, locationName, visibility, committeeName, mandatory, status} = event;
	
	return (
		<tr onClick={() => navigate(`/portal/event/${_id}`)}>
			<td className="name">{name}</td>
			<td className="desc">{description}</td>
			<td className="start">{new Date(start).toLocaleString("en-US", DATE_OPTIONS)}</td>
			<td className="end">{new Date(end).toLocaleString("en-US", DATE_OPTIONS)}</td>
			<td className="location">{locationName}</td>
			<td className="vis">{visibility}</td>
			<td className="com">{committeeName}</td>
			<td className="mandatory">{mandatory ? "Yes" : "No"}</td>
			{status && <td className="status" style={STATUS_STYLES[status]}>{status}</td>}
		</tr>
	);
};

const Events = ({events, collection, sort, navigate, emptyRow, status}: EventTableProps) => {
	if (!events) return null;

	const collectionEvents = events[collection];
	return (
		<>
			{collectionEvents.length === 0 && emptyRow(status ? 9 : 8)}
			{sortedEvents(collectionEvents, sort).map(event => (
				<EventRow key={event._id} event={event} navigate={navigate}/>
			))}
		</>
	);
};

export default Events;
