import CryptoJS from "crypto-js";

// Convert Uint8Array to Hex
export const arrayToHex = (array: Uint8Array): string => {
  return (
    "0x" +
    Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
  );
};

// Convert Hex to Uint8Array
// const hexToArray = (hex: string): Uint8Array => {
//     return new Uint8Array(hex.slice(2).match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
// }

// Generate a 256-bit private key and return it as a hex string

export const generateSHA256 = (data: string): `0x${string}` => {
  const hash = CryptoJS.SHA256(data);
  return `0x${hash.toString(CryptoJS.enc.Hex)}`;
};

export const generatePrivateKey = (): `0x${string}` => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return arrayToHex(array) as `0x${string}`;
};

// Encrypt function
export const encrypt = async (
  data: string,
  privateKeyHex: string
): Promise<string> => {
  return new Promise((resolve) => {
    const key = CryptoJS.enc.Hex.parse(privateKeyHex.slice(2)); // Remove '0x'
    const encrypted = CryptoJS.AES.encrypt(data, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    resolve(encrypted.toString());
  });
};

// Decrypt function
export const decrypt = async (
  encryptedData: string,
  privateKeyHex: string
): Promise<string> => {
  return new Promise((resolve) => {
    const key = CryptoJS.enc.Hex.parse(privateKeyHex.slice(2)); // Remove '0x'
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    resolve(CryptoJS.enc.Utf8.stringify(decrypted));
  });
};
