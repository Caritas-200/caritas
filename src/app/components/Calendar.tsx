"use client";

import React, { useState, useEffect } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  setMonth,
  setYear,
} from "date-fns";
import { saveEvent, loadEvents } from "@/app/lib/api/home/data";
import EventDialog from "./calendar/DialogModal";
import { Event, EventMap } from "../lib/definitions";
import { Timestamp } from "firebase/firestore";

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<EventMap>({});
  const [showEventModal, setShowEventModal] = useState<boolean>(false);
  const [eventInput, setEventInput] = useState<string>("");

  // State for theme (dark or light)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Determine theme classes based on the state
  const themeClasses = isDarkMode
    ? "bg-gray-800 text-gray-100"
    : "bg-white text-gray-800";

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsMap = await loadEvents();
      setEvents(eventsMap);
    };

    fetchEvents();
  }, []);

  const renderHeader = () => {
    const months = Array.from({ length: 12 }, (_, i) =>
      format(setMonth(currentMonth, i), "MMMM")
    );
    const years = Array.from(
      { length: 10 },
      (_, i) => new Date().getFullYear() - 5 + i
    );

    return (
      <div className="flex justify-between items-center py-4 gap-4">
        {/* Navigation Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className={`ml-2 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}
          >
            Prev
          </button>

          <button
            onClick={() => setCurrentMonth(new Date())}
            className={`ml-2 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}
          >
            Today
          </button>

          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className={`ml-2 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}
          >
            Next
          </button>
        </div>

        {/* Month & Year Dropdowns */}
        <div className="flex space-x-4 items-center whitespace-nowrap">
          {/* Month Dropdown */}
          <select
            value={format(currentMonth, "MMMM")}
            onChange={(e) =>
              setCurrentMonth(
                setMonth(currentMonth, months.indexOf(e.target.value))
              )
            }
            className={`p-2 rounded-lg ${
              isDarkMode
                ? "bg-gray-700 text-gray-100"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {months.map((month, idx) => (
              <option key={idx} value={month}>
                {month}
              </option>
            ))}
          </select>

          {/* Year Dropdown */}
          <select
            value={format(currentMonth, "yyyy")}
            onChange={(e) =>
              setCurrentMonth(setYear(currentMonth, Number(e.target.value)))
            }
            className={`p-2 rounded-lg ${
              isDarkMode
                ? "bg-gray-700 text-gray-100"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {years.map((year, idx) => (
              <option key={idx} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = "EEEE";
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="text-center py-2" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="grid grid-cols-7">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const today = new Date();
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;

        days.push(
          <div
            key={day.toString()}
            className={`p-2 border md:min-h-20 lg:min-h-32  hover:bg-blue-100 cursor-pointer ${
              !isSameMonth(day, monthStart) ? "text-gray-400" : ""
            } ${isSameDay(day, selectedDate) ? "bg-gray-600" : ""}`}
            onClick={() => onDateClick(cloneDay)}
          >
            <div className="relative">
              <span>{formattedDate}</span>
              {isSameDay(day, today) && (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                  Today
                </div>
              )}
            </div>
            <div className="text-sm">
              {events[format(cloneDay, "yyyy-MM-dd")]?.map(
                (
                  event: { event: any[] },
                  idx: React.Key | null | undefined
                ) => (
                  <div key={idx} className="bg-blue-500 mt-1 p-1 rounded">
                    {event.event.join(", ")}
                  </div>
                )
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  const onDateClick = (day: Date) => {
    setSelectedDate(day);
    setShowEventModal(true);
  };

  const addEvent = async () => {
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    const newEvent: Event = {
      event: [eventInput],
      timestamp: Timestamp.fromDate(new Date()),
    };

    setEvents((prevEvents) => ({
      ...prevEvents,
      [dateKey]: prevEvents[dateKey]
        ? [...prevEvents[dateKey], newEvent]
        : [newEvent],
    }));

    setEventInput("");
    setShowEventModal(false);
    await saveEvent(selectedDate, newEvent);
  };

  return (
    <div className={`w-full h-full m-4 rounded-lg mt-8 ${themeClasses}`}>
      <div className={`p-4 shadow-lg min-h-screen rounded-lg ${themeClasses}`}>
        {/* Header and Theme Toggle */}
        <div className="flex justify-between items-center mb-4">
          {renderHeader()}

          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              className={`px-4 py-2 rounded-lg ${
                isDarkMode
                  ? "bg-gray-700 text-gray-100"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? "Switch to Light" : "Switch to Dark"}
            </button>

            {/* Add Event Button */}
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={() => setShowEventModal(true)}
            >
              Add Event
            </button>
          </div>
        </div>

        {renderDays()}
        {renderCells()}
      </div>

      {/* Modal to add event */}
      {showEventModal && (
        <EventDialog
          open={showEventModal}
          setOpen={setShowEventModal}
          selectedDate={selectedDate}
          eventInput={eventInput}
          setEventInput={setEventInput}
          addEvent={addEvent}
        />
      )}
    </div>
  );
};

export default Calendar;
