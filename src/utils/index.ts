import * as crypto from "crypto";

const colorThemeBlue = {
  themeColorMain: "#1e74fd",
  themeColor: "#100c28",
  themeDarkColoRbg: "#1a1237",
  themeColorRgb: "33, 150, 243",
  themeColorShade: "#9f59ff",
  themeColorTextSecondary: "#0707079a",
  themeLightColoRbg: "#f5f5f5",
  themeLightColorText: "#212529",
  themeDarkColorBtn: "rgb(28, 30, 33)",
};

export const truncateAddress = (address: string) => {
  if (!address) return "No Account";
  const match = address.match(
    /^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/,
  );
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};

export const toHex = (num: any) => {
  const val = Number(num);
  return "0x" + val.toString(16);
};

export function generateCodeChallenge(codeVerifier: string) {
  // Bước 1: Hash chuỗi code_verifier bằng SHA-256
  const sha256Hash = crypto.createHash("sha256").update(codeVerifier).digest();

  // Bước 2: Mã hóa kết quả hash thành base64
  const base64Encode = sha256Hash.toString("base64");

  // Bước 3: Chuyển đổi base64 thành base64-url bằng cách thay thế các ký tự không hợp lệ trong URL
  const base64url = base64Encode
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return base64url;
}
