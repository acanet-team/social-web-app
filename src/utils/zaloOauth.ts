///// Utility export functions /////

export function openssl_random_pseudo_bytes(len: number): Uint8Array {
  return window.crypto.getRandomValues(new Uint8Array(len));
}

export function bin2hex(array: Uint8Array): string {
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function generate_state_param(): string {
  // Generates a random 8 digit hex string
  return bin2hex(openssl_random_pseudo_bytes(4));
}

export interface PKCECodes {
  verifier: string;
  challenge: string;
}

export function generate_pkce_codes(): PKCECodes {
  const random = bin2hex(openssl_random_pseudo_bytes(32)); // Generates a random 64-digit hex string
  const code_verifier = base64_urlencode(hex2bin(random).toString());
  const code_challenge = base64_urlencode(sha256bin(code_verifier).toString());
  return {
    verifier: code_verifier,
    challenge: code_challenge,
  };
}

function rightRotate(value: number, amount: number): number {
  return (value >>> amount) | (value << (32 - amount));
}

const sha256 = function (ascii: string): string {
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = "length";

  let result = "";

  const words: number[] = [];
  const asciiBitLength = ascii[lengthProperty] * 8;

  const hash: number[] = [];
  const k: number[] = [];
  let primeCounter = 0;

  const isComposite: { [key: number]: boolean } = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (let i = 0; i < 313; i += candidate) {
        isComposite[i] = true;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  ascii += "\x80"; // Append '1' bit (plus zero padding)
  while ((ascii[lengthProperty] % 64) - 56) ascii += "\x00"; // More zero padding
  for (let i = 0; i < ascii[lengthProperty]; i++) {
    const j = ascii.charCodeAt(i);
    if (j >> 8) return ""; // ASCII check: only accept characters in range 0-255
    // @ts-ignore
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
    // words[i >> 2] = (words[i >> 2] || 0) | (j << (((3 - i) % 4) * 8));
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;

  // Process each chunk
  for (let j = 0; j < words[lengthProperty]; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = [...hash];

    const truncatedHash = hash.slice(0, 8);

    for (let i = 0; i < 64; i++) {
      const w15 = w[i - 15],
        w2 = w[i - 2];

      const a = truncatedHash[0],
        e = truncatedHash[4];
      const temp1 =
        // @ts-ignore
        truncatedHash[7] + // @ts-ignore
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) + // S1
        // @ts-ignore
        ((e & truncatedHash[5]) ^ (~e & truncatedHash[6])) + // @ts-ignore
        k[i] + // @ts-ignore
        (w[i] = // @ts-ignore
          i < 16
            ? w[i] // @ts-ignore
            : (w[i - 16] + // @ts-ignore
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) + // @ts-ignore
                w[i - 7] + // @ts-ignore
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) | // @ts-ignore
              0);
      const temp2 = // @ts-ignore
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) + // @ts-ignore // S0
        ((a & truncatedHash[1]) ^ // @ts-ignore
          (a & truncatedHash[2]) ^ // @ts-ignore
          (truncatedHash[1] & truncatedHash[2])); // maj

      truncatedHash.unshift((temp1 + temp2) | 0); // @ts-ignore
      truncatedHash[4] = (truncatedHash[4] + temp1) | 0;
    }

    for (let i = 0; i < 8; i++) {
      // @ts-ignore
      hash[i] = (truncatedHash[i] + oldHash[i]) | 0;
    }
  }

  for (let i = 0; i < 8; i++) {
    for (let j = 3; j + 1; j--) {
      // @ts-ignore
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? "0" : "") + b.toString(16);
    }
  }
  return result;
};

export function hex2bin(s: string): Uint8Array {
  const ret: number[] = [];
  const l = s.length;

  for (let i = 0; i < l; i += 2) {
    const c = parseInt(s.charAt(i), 16);
    const k = parseInt(s.charAt(i + 1), 16);
    if (isNaN(c) || isNaN(k)) return new Uint8Array(0);
    ret.push((c << 4) | k);
  }

  return new Uint8Array(ret);
}

export function dec2hex(dec: number): string {
  return dec.toString(16).padStart(2, "0");
}

// Converts an array of integers to binary data
export function dec2bin(arr: number[]): Uint8Array {
  return hex2bin(arr.map(dec2hex).join(""));
}

export function sha256bin(ascii: string): Uint8Array {
  return hex2bin(sha256(ascii));
}

export function base64_urlencode(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export function random_string(len: number): string {
  const arr = new Uint8Array(len);
  window.crypto.getRandomValues(arr);
  return base64_urlencode(dec2bin(Array.from(arr)).join("")).substring(0, len);
}
