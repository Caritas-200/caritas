import { db } from "@/app/services/firebaseConfig";
import { format } from "date-fns";
import {
  Timestamp,
  doc,
  setDoc,
  arrayUnion,
  collection,
  getDocs,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { Event, EventMap } from "@/app/lib/definitions";

export const saveEvent = async (date: Date, event: Event) => {
  const dateKey = format(date, "yyyy-MM-dd");
  const eventRef = doc(db, "events", dateKey);

  try {
    await setDoc(
      eventRef,
      {
        events: arrayUnion({
          event: event.event,
          timestamp: Timestamp.fromDate(new Date()),
        }),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error saving event: ", error);
  }
};

export const loadEvents = async (): Promise<EventMap> => {
  const eventsRef = collection(db, "events");
  const snapshot = await getDocs(eventsRef);

  const eventsMap: EventMap = {};

  snapshot.forEach((doc) => {
    const data = doc.data();

    if (data.events && Array.isArray(data.events)) {
      eventsMap[doc.id] = data.events.map((event: any) => ({
        event: event.event || [],
        timestamp:
          event.timestamp instanceof Timestamp
            ? event.timestamp.toDate()
            : new Date(event.timestamp),
      }));
    }
  });

  return eventsMap;
};

export const deleteEvent = async (date: Date, event: Event) => {
  const dateKey = format(date, "yyyy-MM-dd");
  const eventRef = doc(db, "events", dateKey);

  try {
    await updateDoc(eventRef, {
      events: arrayRemove({
        event: event.event,
        timestamp: event.timestamp, // Make sure to pass the exact timestamp for accurate deletion
      }),
    });
  } catch (error) {
    console.error("Error deleting event: ", error);
  }
};

export const updateEvent = async (
  date: Date,
  oldEvent: Event,
  updatedEventData: string
) => {
  const dateKey = format(date, "yyyy-MM-dd");
  const eventRef = doc(db, "events", dateKey);

  try {
    // Remove the old event
    await updateDoc(eventRef, {
      events: arrayRemove({
        event: oldEvent.event,
        timestamp: oldEvent.timestamp,
      }),
    });

    // Add the updated event
    await updateDoc(eventRef, {
      events: arrayUnion({
        event: [updatedEventData],
        timestamp: oldEvent.timestamp, // Use the same timestamp to keep track of updates
      }),
    });
  } catch (error) {
    console.error("Error updating event: ", error);
  }
};
