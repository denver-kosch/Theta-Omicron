import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaLocationDot, FaPeopleGroup, FaSortUp, FaSortDown } from "react-icons/fa6";
import api from "@/services/apiCall";
import Events from "@/components/tableElems";
import type {
    EventTableCollection,
    EventTableCollections,
    EventTableRow,
    EventTableSegmentProps,
    EventTableSort,
} from "@/types";

const INITIAL_SORT: EventTableSort = {key: null, direction: "ascending"};

const AllEvents = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState<EventTableCollections | null>(null);
    const [sorts, setSorts] = useState<Record<EventTableCollection, EventTableSort>>({
        approved: {...INITIAL_SORT},
        past: {...INITIAL_SORT},
        comEvents: {...INITIAL_SORT},
        rejEvents: {...INITIAL_SORT},
    });

    useEffect(() => {
        const getEvents = async () => {
            const response = await api<{events: EventTableCollections}>("events?portal=true", {
                headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
            });
            if (response.success) setEvents(response.events);
            else console.error(response.error);
        };

        void getEvents();
    }, []);

    const requestSort = (key: keyof EventTableRow, collection: EventTableCollection) => {
        setSorts(current => {
            const previous = current[collection];
            const next: EventTableSort = previous.key !== key
                ? {key, direction: "ascending"}
                : previous.direction === "ascending"
                    ? {key, direction: "descending"}
                    : {...INITIAL_SORT};
            return {...current, [collection]: next};
        });
    };

    const emptyRow = (columnCount: number) => (
        <tr className="no-hover">
            <td colSpan={columnCount}>No Events Here</td>
        </tr>
    );

    const getSortIcon = (key: keyof EventTableRow, collection: EventTableCollection) => {
        const sort = sorts[collection];
        if (sort.key !== key) return <span style={{width: "1em", display: "inline-block"}}/>;
        return sort.direction === "ascending" ? <FaSortUp/> : <FaSortDown/>;
    };

    const TableSegment = ({title, collection, status, sort}: EventTableSegmentProps) => (
        <>
            <div className="tableSegment">
                <table className="pTable">
                    <thead>
                        <tr><th colSpan={status ? 9 : 8} style={{textAlign: "center"}}>{title}</th></tr>
                        <tr className="tableColumns">
                            <th onClick={() => requestSort("name", collection)}>Name {getSortIcon("name", collection)}</th>
                            <th style={{width: "100%"}} onClick={() => requestSort("description", collection)}>Description {getSortIcon("description", collection)}</th>
                            <th onClick={() => requestSort("start", collection)}>Start {getSortIcon("start", collection)}</th>
                            <th onClick={() => requestSort("end", collection)}>End {getSortIcon("end", collection)}</th>
                            <th onClick={() => requestSort("locationName", collection)}><FaLocationDot/> {getSortIcon("locationName", collection)}</th>
                            <th onClick={() => requestSort("visibility", collection)}><FaEye/> {getSortIcon("visibility", collection)}</th>
                            <th onClick={() => requestSort("committeeName", collection)}><FaPeopleGroup/> {getSortIcon("committeeName", collection)}</th>
                            <th onClick={() => requestSort("mandatory", collection)}>Mandatory? {getSortIcon("mandatory", collection)}</th>
                            {status && <th onClick={() => requestSort("status", collection)}>Status {getSortIcon("status", collection)}</th>}
                        </tr>
                    </thead>
                    <tbody>
                        <Events events={events} collection={collection} sort={sort} navigate={navigate} emptyRow={emptyRow} status={status}/>
                    </tbody>
                </table>
            </div>
            <br/><br/>
        </>
    );

    return (
        <div>
            <button type="button" onClick={() => navigate("/portal/event/create")} style={{marginRight: "auto"}}>Create Event</button>
            <TableSegment title="Upcoming Events" collection="approved" status={false} sort={sorts.approved}/>
            <TableSegment title="Past Events" collection="past" status={false} sort={sorts.past}/>
            <TableSegment title="Committee Events" collection="comEvents" status sort={sorts.comEvents}/>
            <TableSegment title="Rejected Committee Events" collection="rejEvents" status sort={sorts.rejEvents}/>
        </div>
    );
};

export default AllEvents;
