import { createCipheriv, randomBytes, randomInt } from "crypto";

// Builds a ZEGOCLOUD "token04" on the server, in the same format that
// ZegoUIKitPrebuilt.generateKitTokenForTest builds in the browser, so the
// server secret never has to be shipped to clients.
//
// Token = "04" + base64( expire[8] | ivLength[2] | iv[16] | cipherLength[2] | cipher )
// cipher = AES-256-CBC (PKCS#7) of the JSON payload, keyed with the 32-character secret.
export function generateToken04(
  appId: number,
  userId: string,
  serverSecret: string,
  effectiveTimeInSeconds: number
): string {
  if (serverSecret.length !== 32) {
    throw new Error("ZEGO_SERVER_SECRET must be 32 characters long");
  }

  const createTime = Math.floor(Date.now() / 1000);
  const expire = createTime + effectiveTimeInSeconds;
  const payload = JSON.stringify({
    app_id: appId,
    user_id: userId,
    nonce: randomInt(0, 2147483647),
    ctime: createTime,
    expire,
  });

  const iv = randomBytes(8).toString("hex"); // 16 ASCII characters
  const cipher = createCipheriv("aes-256-cbc", Buffer.from(serverSecret, "utf8"), Buffer.from(iv, "utf8"));
  const encrypted = Buffer.concat([cipher.update(payload, "utf8"), cipher.final()]);

  const header = Buffer.alloc(8 + 2 + iv.length + 2);
  header.writeBigInt64BE(BigInt(expire), 0);
  header.writeUInt16BE(iv.length, 8);
  header.write(iv, 10, "utf8");
  header.writeUInt16BE(encrypted.length, 10 + iv.length);

  return "04" + Buffer.concat([header, encrypted]).toString("base64");
}
