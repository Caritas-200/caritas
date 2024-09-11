export const toSentenceCase = (str: string) => {
  if (!str || str.trim() === "") {
    return str; // Return empty or undefined values as is
  }

  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .split(" ")
    .map(
      (word: string) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
};
