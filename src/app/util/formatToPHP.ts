export const formatToPHP = (amount: number): string => {
  const formatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0, // Ensures two decimal places
  });

  return formatter.format(amount);
};
