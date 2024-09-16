import { ConvertType } from "@/types/enum";
import { ethers, type BigNumber } from "ethers";

export default function convertBigNumber(number: BigNumber, type: ConvertType) {
  // console.log(number.toString());
  const bigNumber = ethers.utils.formatEther(number);
  const convertedNumber = Math.round(parseFloat(bigNumber) * 10 ** 18);

  if (type === ConvertType.datetime) {
    const convertedDatetime = new Date(convertedNumber * 1000).toLocaleString();
    return convertedDatetime;
  }
  return convertedNumber;
}
