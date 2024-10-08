interface Contracts {
  Rate: { [key: string]: string };
  Community: { [key: string]: string };
  Donate: { [key: string]: string };
  Nft: { [key: string]: string };
  NftMarket: { [key: string]: string };
}

//0x780c move
//0x61 bsc
const contracts: Contracts = {
  Rate: {
    "0x780c": "0x22ffF292f0c806bc0b33B7F2149AA5E1Dedc7622",
    "0x61": "0xf3262da7eA7B1B78bbfd25A3545d5555c857a693",
  },
  Community: {
    "0x780c": "0x551EcD9ae36926B9b1A4216a0E46f7DCd0b0D461",
    "0x61": "0x7e978d9aF716508eb792e836df529e9E7B5cE20D",
  },
  Donate: {
    "0x780c": "0x5C67181d77cdf3165e1608F907001ED02CF525d1",
    "0x61": "0xDd27e41A3a84e74aAf6E1AcaFfAF0830bc220EE1",
  },
  Nft: {
    "0x780c": "0xbEE253C88CC59fAf26470aE320504D4d9D436d9b",
    "0x61": "0xf55064D3026F2D9991cc470044c3e68788DE3556",
  },
  NftMarket: {
    "0x780c": "0x34638DeAFC70d6F9274fd4Bc310C98033c83fAaB",
    "0x61": "0xE36855F853c44EcC7f9374c353eB2d9C73284cC5",
  },
};

export default contracts;
