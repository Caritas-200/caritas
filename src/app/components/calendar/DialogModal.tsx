import React from "react";
import { DialogPanel, Dialog, DialogTitle } from "@headlessui/react";

interface EventDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedDate: Date;
  eventInput: string;
  setEventInput: (input: string) => void;
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
    <Dialog open={open} onClose={() => setOpen(false)}>
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="mx-auto w-full max-w-sm rounded bg-gray-800 p-6">
          <DialogTitle className="text-lg font-medium text-gray-100">
            {"Add Event"} {" on "} {selectedDate.toDateString()}
          </DialogTitle>

          <textarea
            value={eventInput}
            onChange={(e) => setEventInput(e.target.value)}
            className="mt-2 w-full h-24 bg-gray-700 text-gray-100 rounded p-2"
            placeholder="Event Description"
          />

          <div className="mt-4 flex justify-between">
            <button
              className={`bg-blue-500 ${
                !eventInput.trim() ? "opacity-50" : ""
              } text-white px-4 py-2 rounded`}
              onClick={addEvent}
              disabled={!eventInput.trim()} // Disable button if textarea is empty
            >
              Add Event
            </button>
          </div>
          <button
            className="absolute top-2 right-2 text-gray-500"
            onClick={() => setOpen(false)}
          >
            X
          </button>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default EventDialog;
