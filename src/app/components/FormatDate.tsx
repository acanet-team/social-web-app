export const FormatDate = (dateString: string): string => {
  let date: Date;

  if (dateString.length === 7) {
    const [month, year] = dateString.split("-").map(Number);
    if (month === undefined || year === undefined) {
      throw new Error("Invalid date format");
    }
    date = new Date(year, month - 1);
  } else {
    const [year, month, day] = dateString.split("-").map(Number);
    if (month === undefined || year === undefined) {
      throw new Error("Invalid date format");
    }
    date = new Date(year, month - 1);
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};
