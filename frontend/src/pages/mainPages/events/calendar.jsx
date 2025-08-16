import { useEffect, useState, useCallback } from "react";
import api from "@/services/apiCall";
import Modal from 'react-modal';
import { useNavigate } from "react-router-dom";

//Display them in a calendar format
//Clicking on a date will take you to modal with the events for that date
//Clicking on an event will take you to the event details page

Modal.setAppElement("#root");

const EventCal = () => {
    const [events, setEvents] = useState();
    const [loading, setLoading] = useState(true);
    const [eventCache, updateCache] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const currentDate = new Date();
    const navigate = useNavigate();

    const fetchEvents = async (month, year) => {
        setLoading(true);
        let events = [];
        try {
            const response = await api(`events?month=${month+1}&year=${year}&status=Approved`);
            const { success, error } = response;
            if (success) {
                events = response.events;
                updateCache(prev => ({ ...prev, [month]: { year, events } }));
            } else throw new Error(error);
        } catch (err) {
            console.error(err);
        } finally {
            setEvents(events);
            setLoading(false);
        }
    };

    useEffect(() => {
        const year = selectedMonth.getFullYear();
        const month = selectedMonth.getMonth();
        const cached = eventCache[month];

        if (!cached || cached.year !== year) fetchEvents(month, year);
        else setEvents(cached.events);
    }, [selectedMonth, eventCache]);

    const Calendar = () => {
        const startDay = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1).getDay();
        const daysInMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate();
        const calendar = [];

        const totalCells = startDay + daysInMonth;
        const endDay = totalCells % 7;
        const totalGridCells = endDay === 0 ? totalCells : totalCells + (7 - endDay);

        const handleNavigate = useCallback((e) => {navigate(`/event/${e.currentTarget.dataset.id}`)}, [navigate]);
    
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
                    <td key={`day-${day}`} className={`calendar-day ${currentDate.getMonth() === selectedMonth.getMonth() && currentDate.getDate() === day && selectedMonth.getFullYear() === currentDate.getFullYear() ? "currentDay" : ""}`} onClick={() => setSelectedDate(dayDate)}>
                        <h3>{day}</h3>
                        {!loading && (() => {
                            const visibleEvents = dayEvents.slice(0, 2);
                            const hiddenEvents = dayEvents.length > 2 ? dayEvents.length - 2 : 0;

                            return (
                                <>
                                {visibleEvents.map(event => (
                                    <div
                                      key={event._id}
                                      className="event-pill"
                                      data-id={event._id}
                                      onClick={e => {
                                        e.stopPropagation();
                                        handleNavigate(e);
                                      }}
                                    >
                                      {event.name}
                                    </div>
                                ))}
                                {hiddenEvents > 0 && (
                                    <div
                                      className="event-pill more"
                                      onClick={e => {
                                        e.stopPropagation();
                                        setSelectedDate(dayDate);
                                      }}
                                    >
                                      +{hiddenEvents} more
                                    </div>
                                )}
                                </>
                            );
                        })()}
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
                    <tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>
                </thead>
                <tbody>
                    {weeks.map((week, index) => <tr key={index}>{week}</tr>)}
                    {weeks.length < 5 && <tr><td colSpan={7} className="empty-cell"></td></tr>}
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