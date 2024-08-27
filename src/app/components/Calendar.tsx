"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import the default styles

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const Hero: React.FC = () => {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div className="flex-1 p-8 bg-gray-700">
      <h2 className="text-3xl font-bold mb-4 text-white">Activity Calendar</h2>
      <div className="bg-black shadow-md rounded-lg p-6">
        <Calendar
          onChange={onChange}
          value={value}
          className="w-full h-full text-black"
          tileClassName="p-2"
          // You can use this to add events or custom content to calendar tiles
          tileContent={({ date, view }) => {
            // Check if there is an event on this date and return custom content
            const events = getEventsForDate(date); // Assume a function that returns events
            return events.length ? (
              <div className="bg-blue-500 text-xs text-white rounded-md p-1">
                {events.map((event, index) => (
                  <div key={index}>{event}</div>
                ))}
              </div>
            ) : null;
          }}
        />
      </div>
    </div>
  );
};

// Example function to get events for a specific date
function getEventsForDate(date: Date): string[] {
  // This would normally come from a backend or context
  const events: Record<string, string[]> = {
    "2024-08-29": ["Event 1"],
    "2024-09-02": ["Event 3"],
    // Add more events as needed
  };

  const dateString = date.toISOString().split("T")[0];
  return events[dateString] || [];
}

export default Hero;
