import crypto from "crypto";

function createKey(length = 32) {
  /**
   * Generate a random key in the format of OpenAI's API keys.
   * @param {number} [length=32] - The length of the key.
   * @returns {string} A random key in the format of OpenAI's API keys.
   */
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const key = [];
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomBytes(1).readUInt8() % characters.length;
    key.push(characters[randomIndex]);
  }
  return "gr-" + key.join("");
}

export default createKey;
