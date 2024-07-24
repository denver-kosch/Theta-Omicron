import { useEffect, useState } from "react";
import apiCall from "../../../services/apiCall";
import Modal from 'react-modal';

//Display them in a calendar format
//Clicking on a date will take you to modal with the events for that date
//Clicking on an event will take you to the event details page

Modal.setAppElement("#root");

const EventCal = () => {
    const [events, setEvents] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [eventCache, updateCache] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
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
                const dayDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day);
                const dayStart = dayDate.getTime();
                const dayEnd = new Date(dayDate.getFullYear(), dayDate.getMonth(), day + 1).getTime() - 1;
                
                const dayEvents = !loading && events.filter(event => {
                    const start = new Date(event.time.start).getTime();
                    const end = new Date(event.time.end).getTime();
                    return start <= dayEnd && end >= dayStart;
                });

                calendar.push(
                    <td key={`day-${day}`} className={`calendar-day ${currentDate.getMonth() === selectedMonth.getMonth() && currentDate.getDate() === day && selectedMonth.getFullYear() === currentDate.getFullYear() ? "currentDay" : ""}`}>
                        <h3>{day}</h3>
                        {!loading && dayEvents.map(event => {
                            const start = new Date(event.time.start);
                            const end = new Date(event.time.end);

                            //Number of days the event spans
                            const eventSpan = Math.ceil((end.getTime() - start.getTime()) / (24000*3600));
                            //Is current day the start or end of the week
                            const startingEventDay = start.getDate() === day && start.getMonth() === selectedMonth.getMonth() && start.getFullYear() === selectedMonth.getFullYear();
                            const endingEventDay = end.getDate() === day && end.getMonth() === selectedMonth.getMonth() && end.getFullYear() === selectedMonth.getFullYear();
                            //Width of the ribbon

                            const calculateWidth = () => {
                                const daysRemainingInWeek = 7 - (day % 7);
                                const daysPassedInWeek = day % 7 + 1;
                            
                                if ((Math.floor(start.getDate() / 7) !== Math.floor(end.getDate() / 7))) {
                                  if (startingEventDay) return daysRemainingInWeek;
                                  
                                  else if (endingEventDay) return daysPassedInWeek;
                                  
                                  return 0;
                                }
                                return eventSpan;
                            };
                            const width = calculateWidth();

                            const shouldDisplayRibbon = startingEventDay || (endingEventDay && (Math.floor(start.getDate() / 7) !== Math.floor(end.getDate() / 7)));

                            return (
                                shouldDisplayRibbon && <div
                                key={event._id}
                                className={`ribbon`}
                                style={{
                                    left: day === start.getDate() ? '0%' : '',
                                    right: day === end.getDate() ? '0%' : '',
                                    width: `calc(${width}*100%)`,
                                }}
                                >{event.name}</div>
                    )})}
                    </td>
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
                        <tr key={index} style={{height: `calc(100%/${weeks.length})`}}>
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