export const dateInfo = (dateString: string) => {
  const date = new Date(dateString);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based, so we add 1 to get the correct month

  return `created on ${day}-${month} at ${hours}:${minutes}`;
};

export const formatDateExtra = (dateString: string) => {
  const date = new Date(dateString);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based, so we add 1 to get the correct month
  const year = date.getFullYear().toString();

  return `${hours}:${minutes}:${seconds}, ${day}-${month}-${year}`;
};
