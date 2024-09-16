import { ethers, type BigNumber } from "ethers";
import type { Hexable } from "ethers/lib/utils";

export default function convertBigNumber(number: BigNumber) {
  const bigNumber = ethers.utils.formatEther(number);
  const finalNumber = Math.round(parseFloat(bigNumber) * 10 ** 18);
  return finalNumber;
}
