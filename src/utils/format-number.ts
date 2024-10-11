export function formatNumber(num: number) {
  let formattedNum = num.toString();

  // If the number is in scientific notation, convert it back to decimal
  if (formattedNum.includes("e")) {
    // Use Number to reformat, and then convert back to string
    formattedNum = num.toFixed(9).replace(/(\.\d*[1-9])0+$|\.0*$/, "$1");
  } else {
    // Remove trailing zeros, keeping up to the last non-zero digit
    formattedNum = formattedNum.replace(/(\.\d*[1-9])0+$|\.0*$/, "$1");
  }

  // Split the number into integer and decimal parts
  const [integerPart, decimalPart] = formattedNum.split(".");

  // Add comma thousand separator to the integer part
  const formattedIntegerPart = integerPart
    ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : "";

  // Recombine the integer and decimal parts
  return decimalPart
    ? `${formattedIntegerPart}.${decimalPart}`
    : formattedIntegerPart;
}
