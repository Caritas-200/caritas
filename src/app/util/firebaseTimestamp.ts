import { Timestamp } from "firebase/firestore";

export const convertFirebaseTimestamp = (
  timestamp: Timestamp | { seconds: number; nanoseconds: number }
): string => {
  // Handle Firebase Timestamp
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  // Handle plain { seconds, nanoseconds } object
  const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};
