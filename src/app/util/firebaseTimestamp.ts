import { Timestamp } from "firebase/firestore";

export const convertFirebaseTimestamp = (timestamp: Timestamp): string => {
  const date = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
  ); // Convert to milliseconds
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};
