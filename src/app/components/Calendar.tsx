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
import {
  saveEvent,
  loadEvents,
  deleteEvent,
  updateEvent,
} from "@/app/lib/api/home/data";
import EventDialog from "./calendar/DialogModal";
import { Event, EventMap } from "../lib/definitions";
import { Timestamp } from "firebase/firestore";
import { toSentenceCase } from "../util/toSentenceCase";

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<EventMap>({});
  const [showEventModal, setShowEventModal] = useState<boolean>(false);
  const [eventInput, setEventInput] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);

  // Fixed theme to dark mode
  const themeClasses = "bg-gray-800 text-gray-100";

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
            className="ml-2 text-gray-100"
          >
            Prev
          </button>

          <button
            onClick={() => setCurrentMonth(new Date())}
            className="ml-2 text-gray-100"
          >
            Today
          </button>

          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="ml-2 text-gray-100"
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
            className="p-2 rounded-lg bg-gray-700 text-gray-100"
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
            className="p-2 rounded-lg bg-gray-700 text-gray-100"
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
            className={`p-2 border md:min-h-20 lg:min-h-32 hover:bg-blue-500 cursor-pointer ${
              !isSameMonth(day, monthStart) ? "text-gray-400" : ""
            } ${isSameDay(day, selectedDate) ? "bg-blue-500" : ""}`}
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
                (event: Event, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-700 mt-1 p-2 rounded flex justify-between items-center"
                  >
                    <span className="text-white">
                      {toSentenceCase(event.event.join(", "))}
                    </span>
                    <div className="flex space-x-2">
                      {/* Edit Button */}
                      <button
                        className="hover:text-yellow-500 text-lg opacity-70 hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the day click
                          handleEditEvent(cloneDay, event);
                        }}
                      >
                        ✎
                      </button>
                      {/* Delete Button */}
                      <button
                        className="hover:text-red-500 text-lg opacity-70 hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the day click
                          handleDeleteEvent(cloneDay, event);
                        }}
                      >
                        ✖
                      </button>
                    </div>
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

  const handleEditEvent = (day: Date, event: Event) => {
    setSelectedDate(day);
    setEventInput(event.event.join(", "));
    setEventToEdit(event);
    setIsEditing(true);
    setShowEventModal(true);
  };

  const handleDeleteEvent = async (day: Date, event: Event) => {
    await deleteEvent(day, event);
    setEvents((prevEvents) => {
      const dateKey = format(day, "yyyy-MM-dd");
      return {
        ...prevEvents,
        [dateKey]: prevEvents[dateKey].filter(
          (e) => e.timestamp !== event.timestamp // Ensure to match the timestamp for deletion
        ),
      };
    });
  };

  const onDateClick = (day: Date) => {
    setSelectedDate(day);
    setShowEventModal(true);
  };

  const addOrUpdateEvent = async () => {
    const dateKey = format(selectedDate, "yyyy-MM-dd");

    if (isEditing && eventToEdit) {
      // Update event
      await updateEvent(selectedDate, eventToEdit, eventInput);

      // Update events state
      setEvents((prevEvents) => ({
        ...prevEvents,
        [dateKey]: prevEvents[dateKey].map((e) =>
          e.timestamp === eventToEdit.timestamp
            ? { ...e, event: [eventInput] }
            : e
        ),
      }));
    } else {
      // Add new event
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

      await saveEvent(selectedDate, newEvent);
    }

    // Reset modal and states
    setEventInput("");
    setIsEditing(false);
    setEventToEdit(null);
    setShowEventModal(false);
  };

  const resetModal = () => {
    setEventInput("");
    setIsEditing(false);
    setEventInput("");
  };

  return (
    <div className={`w-full h-full m-4 rounded-lg mt-8 ${themeClasses}`}>
      <div className={`p-4 shadow-lg min-h-screen rounded-lg ${themeClasses}`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          {renderHeader()}

          {/* Add Event Button */}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={() => setShowEventModal(true)}
          >
            Add Event
          </button>
        </div>

        {renderDays()}
        {renderCells()}
      </div>

      {/* Modal to add event */}
      {showEventModal && (
        <EventDialog
          open={showEventModal}
          setOpen={(open) => {
            setShowEventModal(open);
            if (!open) resetModal();
          }}
          selectedDate={selectedDate}
          eventInput={eventInput}
          setEventInput={setEventInput}
          addEvent={addOrUpdateEvent}
          isEditing={isEditing}
        />
      )}
    </div>
  );
};

export default Calendar;
