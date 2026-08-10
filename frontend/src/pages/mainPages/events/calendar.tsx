import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/apiCall";
import { Calendar } from "@fullcalendar/core";
import type { EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import type { ApiResponse, EventType } from "@/types";

export default function EventCal() {
    const calendarElRef = useRef<HTMLDivElement | null>(null);
    const calendarInstanceRef = useRef<Calendar | null>(null);
    const eventCacheRef = useRef<Record<string, EventInput[]>>({});
    const navigate = useNavigate();

    useEffect(() => {
        if (!calendarElRef.current || calendarInstanceRef.current) return;

        const fetchEvents = async (month: number, year: number): Promise<EventInput[]> => {
            const cacheKey = `${year}-${month}`;

            if (eventCacheRef.current[cacheKey]) return eventCacheRef.current[cacheKey];

            try {
                const response = await api(`events?month=${month + 1}&year=${year}&status=Approved`) as ApiResponse<{ events: EventType[]; }>;
                if (!response.success) throw new Error(response.error);

                const mappedEvents: EventInput[] = response.events.map(event => ({
                    id: event._id,
                    title: event.name,
                    start: event.time.start,
                    end: event.time.end,
                }));

                eventCacheRef.current[cacheKey] = mappedEvents;
                return mappedEvents;
            } catch (err) {
                console.error("Failed to fetch events:", err);
                return [];
            }
        };

        const calendar = new Calendar(calendarElRef.current, {
            plugins: [dayGridPlugin, listPlugin],
            initialView: window.innerWidth < 768 ? "listMonth" : "dayGridMonth",
            headerToolbar: {
                right: "today prev,next",
                center: "title",
                left: "dayGridMonth,listMonth",
            },
            buttonText: {
                dayGridMonth: "Month",
                listMonth: "List",
                today: "Today",
            },
            datesSet: async (info) => {
                const month = info.view.currentStart.getMonth();
                const year = info.view.currentStart.getFullYear();
                const events = await fetchEvents(month, year);
                if (!calendarInstanceRef.current) return;
                calendarInstanceRef.current.removeAllEvents();
                calendarInstanceRef.current.addEventSource(events);
            },
            eventClick: (info) => {
                info.jsEvent.preventDefault();
                const eventEnd = info.event.end || info.event.start;
                if (eventEnd && eventEnd < (new Date())) return;
                navigate(`/event/${info.event.id}`);
            },
        });

        calendarInstanceRef.current = calendar;
        calendar.render();

        return () => {
            calendar.destroy();
            calendarInstanceRef.current = null;
        };
    }, [navigate]);

    return <div ref={calendarElRef} />;
}
