export const TimeSinceDate = (date: string | number): string => {
  const postDate = new Date(date);
  const timeSincePostDate = new Date().getTime() - postDate.getTime();

  const minutes = Math.floor(timeSincePostDate / (1000 * 60));
  const hours = Math.floor(timeSincePostDate / (1000 * 60 * 60));
  const days = Math.floor(timeSincePostDate / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(timeSincePostDate / (1000 * 60 * 60 * 24 * 7));

  let timePassed;
  if (weeks > 0) {
    timePassed = `${weeks} week${weeks > 1 ? "s" : ""}`;
  } else if (days > 0) {
    timePassed = `${days} day${days > 1 ? "s" : ""}`;
  } else if (hours > 0) {
    timePassed = `${hours} hour${hours > 1 ? "s" : ""}`;
  } else {
    timePassed =
      minutes > 0 ? `${minutes} minute${minutes > 1 ? "s" : ""}` : "now";
  }

  return timePassed;
};
