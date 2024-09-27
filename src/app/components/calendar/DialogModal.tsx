import React, { Dispatch, SetStateAction } from "react";
import { Dialog } from "@headlessui/react";
import { format } from "date-fns";

interface EventDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selectedDate: Date;
  eventInput: string;
  setEventInput: Dispatch<SetStateAction<string>>;
  addEvent: () => void;
}

const EventDialog: React.FC<EventDialogProps> = ({
  open,
  setOpen,
  selectedDate,
  eventInput,
  setEventInput,
  addEvent,
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl mb-4 text-gray-700">
          Add Event for {format(selectedDate, "MMMM d, yyyy")}
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select Date:</label>
          <input
            type="date"
            className="w-full p-2 border rounded text-gray-700"
            value={format(selectedDate, "yyyy-MM-dd")}
            onChange={(e) =>
              setEventInput(new Date(e.target.value).toISOString())
            }
          />
        </div>
        <input
          type="text"
          className="w-full p-2 border rounded text-gray-700"
          placeholder="Event name"
          value={eventInput}
          onChange={(e) => setEventInput(e.target.value)}
        />
        <div className="flex justify-end space-x-2 mt-4">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
          <button
            className={`bg-blue-500 text-white px-4 py-2 rounded ${
              !eventInput ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={addEvent}
            disabled={!eventInput}
          >
            Add Event
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default EventDialog;
