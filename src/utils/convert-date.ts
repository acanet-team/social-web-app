const convertDate = (date: number) => {
  const newDate = new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return newDate;
};

export default convertDate;
