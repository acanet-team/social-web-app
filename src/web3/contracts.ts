interface Contracts {
  Rate: { [key: string]: string };
  Community: { [key: string]: string };
  Donate: { [key: string]: string };
}

//0x780c move
//0x61 bsc
const contracts: Contracts = {
  Rate: {
    "0x780c": "0x8B97B03BFe1C42dffe12FCA4F30685474c3Ae2e4",
    "0x61": "0xb746AeD23EEF40df58FfA54673453661BE04B36D",
  },
  Community: {
    "0x780c": "0x551EcD9ae36926B9b1A4216a0E46f7DCd0b0D461",
    "0x61": "0x7e978d9aF716508eb792e836df529e9E7B5cE20D",
  },
  Donate: {
    "0x780c": "0x5C67181d77cdf3165e1608F907001ED02CF525d1",
    "0x61": "0xDd27e41A3a84e74aAf6E1AcaFfAF0830bc220EE1",
  },
};

export default contracts;
