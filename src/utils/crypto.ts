import { sha256 } from "crypto-hash";

///// Utility functions /////
function openssl_random_pseudo_bytes(len: number): Uint8Array {
  return window.crypto.getRandomValues(new Uint8Array(len));
}

function bin2hex(array: Uint8Array): string {
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function generate_state_param() {
  // a random 8 digit hex, for instance
  return bin2hex(openssl_random_pseudo_bytes(4));
}

async function generate_pkce_codes() {
  let random = bin2hex(openssl_random_pseudo_bytes(32));
  let code_verifier = base64_urlencode(hex2bin(random));
  let code_challenge = base64_urlencode(await sha256bin(code_verifier));
  return {
    verifier: code_verifier,
    challenge: code_challenge,
  };
}

function hex2bin(s: string) {
  const ret: number[] = [];
  let i = 0;
  let l: number;

  s += "";

  for (l = s.length; i < l; i += 2) {
    const c = parseInt(s.substr(i, 1), 16);
    const k = parseInt(s.substr(i + 1, 1), 16);
    if (isNaN(c) || isNaN(k)) return false;
    ret.push((c << 4) | k);
  }

  return String.fromCharCode.apply(String, ret);
}

function dec2hex(dec: number): string {
  return ("0" + dec.toString(16)).substr(-2);
}

// Array of integers to binary data
function dec2bin(arr: number[]) {
  return hex2bin(Array.from(arr, dec2hex).join(""));
}

async function sha256bin(ascii: string) {
  return hex2bin(await sha256(ascii));
}

function base64_urlencode(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function random_string(len: number): string {
  const arr = new Uint8Array(len);
  window.crypto.getRandomValues(arr);
  const str = base64_urlencode(dec2bin(Array.from(arr)) as string);
  return str.substring(0, len);
}
