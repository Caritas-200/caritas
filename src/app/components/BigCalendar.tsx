"use client";

import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Modal, Button, Form } from "react-bootstrap";

const localizer = momentLocalizer(moment);

interface Event {
  title: string;
  start: Date;
  end: Date;
}

const MyCalendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: new Date(),
    end: new Date(),
  });

  const handleSelect = ({ start }: { start: Date }) => {
    setNewEvent({ title: "", start, end: start });
    setShowModal(true);
  };

  const handleAddEvent = () => {
    setEvents([...events, newEvent]);
    setShowModal(false);
  };

  return (
    <div style={{ height: "100vh" }}>
      <Calendar
        localizer={localizer}
        events={events}
        selectable
        onSelectSlot={handleSelect}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
      />

      {/* Modal for adding event */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEventTitle">
              <Form.Label>Event Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter event title"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formEventStart" className="mt-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="datetime-local"
                value={moment(newEvent.start).format("YYYY-MM-DDTHH:mm")}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, start: new Date(e.target.value) })
                }
              />
            </Form.Group>
            <Form.Group controlId="formEventEnd" className="mt-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="datetime-local"
                value={moment(newEvent.end).format("YYYY-MM-DDTHH:mm")}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, end: new Date(e.target.value) })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddEvent}>
            Add Event
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyCalendar;
