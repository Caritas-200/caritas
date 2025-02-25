import React from "react";
import { DialogPanel, Dialog, DialogTitle } from "@headlessui/react";

interface EventDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedDate: Date;
  eventInput: string;
  setEventInput: (input: string) => void;
  addEvent: () => void;
  isEditing: boolean;
}

const EventDialog: React.FC<EventDialogProps> = ({
  open,
  setOpen,
  selectedDate,
  eventInput,
  setEventInput,
  addEvent,
  isEditing,
}) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <div
        className="fixed text-text-color inset-0 bg-black/30"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="mx-auto w-full max-w-sm rounded  bg-white-primary p-6">
          <div className="flex justify-end">
            <button
              className="hover:text-red-500 text-lg opacity-70 hover:opacity-100 mt-[-12px]"
              onClick={() => setOpen(false)}
            >
              ✖
            </button>
          </div>

          <DialogTitle className="text-lg font-medium ">
            {isEditing ? "Edit Event" : "Add Event"} on{" "}
            {selectedDate.toDateString()}
          </DialogTitle>

          <textarea
            value={eventInput}
            onChange={(e) => setEventInput(e.target.value)}
            className="mt-2 w-full h-24 bg-bg-color 0 rounded p-2 outline-none"
            placeholder="Event Description"
          />

          <div className="mt-4 flex justify-center">
            <button
              className={`bg-blue-500 ${
                !eventInput.trim() ? "opacity-50" : ""
              } text-white px-4 py-2 rounded`}
              onClick={addEvent}
              disabled={!eventInput.trim()}
            >
              {isEditing ? "Update Event" : "Add Event"}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default EventDialog;
