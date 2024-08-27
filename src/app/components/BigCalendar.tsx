"use client";

import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css"; // Import styles

const localizer = momentLocalizer(moment);

// Hardcoded events for demonstration
const myEventsList = [
  {
    title: "Meeting with Team",
    start: new Date(2024, 8, 25, 10, 0), // September 25, 2024, 10:00 AM
    end: new Date(2024, 8, 25, 11, 0), // September 25, 2024, 11:00 AM
  },
  {
    title: "Project Deadline",
    start: new Date(2024, 8, 30, 17, 0), // September 30, 2024, 5:00 PM
    end: new Date(2024, 8, 30, 18, 0), // September 30, 2024, 6:00 PM
  },
];

const MyCalendar: React.FC = () => (
  <div style={{ height: "100vh" }}>
    <Calendar
      localizer={localizer}
      events={myEventsList}
      startAccessor="start"
      endAccessor="end"
      style={{ height: "100%" }}
    />
  </div>
);

export default MyCalendar;
