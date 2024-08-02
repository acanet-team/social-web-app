export const TimeSinceDate = (date: string | number): string => {
  const postDate = new Date(date);
  const timeSincePostDate = new Date().getTime() - postDate.getTime();

  // Calculate the time passed in different units
  const minutes = Math.floor(timeSincePostDate / (1000 * 60));
  const hours = Math.floor(timeSincePostDate / (1000 * 60 * 60));
  const days = Math.floor(timeSincePostDate / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(timeSincePostDate / (1000 * 60 * 60 * 24 * 7));

  // Determine the most appropriate unit to display
  let timePassed;
  if (!timeSincePostDate || isNaN(timeSincePostDate) || timeSincePostDate < 0) {
    timePassed = "";
  }
  if (timeSincePostDate === 0) {
    timePassed = "now";
  }
  if (weeks > 0) {
    timePassed = `${weeks} week${weeks > 1 ? "s" : ""}`;
  } else if (days > 0) {
    timePassed = `${days} day${days > 1 ? "s" : ""}`;
  } else if (hours > 0) {
    timePassed = `${hours} hour${hours > 1 ? "s" : ""}`;
  } else {
    timePassed = `${minutes} minute${minutes > 1 ? "s" : ""}`;
  }

  return timePassed;
};
