import React from "react";
import { Calendar, momentLocalizer, Event } from "react-big-calendar";
import moment from "moment";

// Create a localizer with moment.js
const localizer = momentLocalizer(moment);

// Define types for the events if they are passed as props
interface MyCalendarProps {
  events: Event[];
}

// Example events list, you should replace it with actual event data or fetch it from props
const myEventsList: Event[] = [
  // Replace this with your event data
  {
    title: "Event 1",
    start: new Date(),
    end: new Date(),
  },
  // Add more events as needed
];

const MyCalendar: React.FC<MyCalendarProps> = ({ events }) => (
  <div>
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
    />
  </div>
);

export default MyCalendar;
