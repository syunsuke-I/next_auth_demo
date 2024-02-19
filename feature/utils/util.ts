import { randomBytes } from "crypto";

export function generateToken(length: number) {
  // 指定された長さの半分のバイト数のランダムデータを生成（16進数に変換すると長さが2倍になるため）
  const token = randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
  return token;
}