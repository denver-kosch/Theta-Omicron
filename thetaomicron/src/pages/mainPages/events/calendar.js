import { useEffect, useState } from "react";
import apiCall from "../../../services/apiCall";

//Get all approved events,
//Display them in a calendar format
//Clicking on a date will take you to modal with the events for that date
//Clicking on an event will take you to the event details page

const EventCal = () => {
    const [events, setEvents] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [eventCache, updateCache] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const currentDate = new Date();

    //TODO Add optional month feature, make dictionary, and cache month info in it (include year to accomodate for cache misses)
    const fetchEvents = async (month, year) => {
        setLoading(true);
        try {
            const result = await apiCall('getEvents', { status: 'Approved', timeframe: {month, year} });
            if (result.success) {
                const events = result.events;
                updateCache(prevCache => ({
                    ...prevCache,
                    [month]: { year, events }
                }));
                setLoading(false);
                return events;
            } else {
                setError(result.error);
                setLoading(false);
                return [];
            }
        } catch (error) {
            console.error(error);
            setError(error);
            setLoading(false);
            return [];
        }
    };

    useEffect(() => {
        const year = selectedMonth.getFullYear();
        const month = selectedMonth.getMonth();

        if (eventCache[month]?.year !== year) fetchEvents(month, year).then(fetchedEvents => setEvents(fetchedEvents));
        else setEvents(eventCache[month].events);
        
    }, [selectedMonth, eventCache]);

    const Calendar = () => {
        const startDay = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1).getDay();
        const daysInMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate();
        const calendar = [];

        const totalCells = startDay + daysInMonth;
        const endDay = totalCells % 7;
        const totalGridCells = endDay === 0 ? totalCells : totalCells + (7 - endDay);
    
        for (let i = 0; i < totalGridCells; i++) {
            if (i < startDay || i >= totalCells) calendar.push(<td key={`empty-${i}`} className="empty-cell"></td>);
            else {
                const day = i - startDay + 1;
                calendar.push(
                    currentDate.getMonth() === selectedMonth.getMonth() && currentDate.getDate() === day ?
                        <td key={`day-${day}`} className="calendar-day currentDay"><h3>{day}</h3></td> :
                        <td key={`day-${day}`} className="calendar-day"><h3>{day}</h3></td>
                );
            }
        }
        
        // Group the calendar cells into weeks
        const weeks = [];
        for (let i = 0; i < calendar.length; i += 7) weeks.push(calendar.slice(i, i + 7));
        
    
        return (
            <>
            <div className="calendar-header">
                <button onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}>
                    &lt;
                </button>
                <h2>{selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                <button onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}>
                    &gt;
                </button>
            </div>
            <table className="calendar">
                <thead>
                    <tr>
                        <th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th>
                    </tr>
                </thead>
                <tbody>
                    {weeks.map((week, index) => 
                        <tr key={index}>
                            {week}
                        </tr>
                    )}
                    {weeks.length < 5 &&
                        <tr><td colSpan={7} className="empty-cell"></td></tr>
                    }
                </tbody>
            </table>
            </>
        );
    };
    

    return (
        <div className='eventCal'>
            <h1>Event Calendar</h1>
            <Calendar/>
        </div>
    );
};

export default EventCal;