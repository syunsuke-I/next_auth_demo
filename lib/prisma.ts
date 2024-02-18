import { PrismaClient } from "@prisma/client";

// グローバルスコープに prisma オブジェクトを宣言します。
// これによりアプリケーション全体で１つの PrismaClient インスタンスを共有できます
declare global {
  var prisma: PrismaClient | undefined;
}

// globalThis.prisma が存在する場合はそれを使用し、
// 存在しない場合は新しい PrismaClient インスタンスを作成します
// これで不必要に多くのインスタンスが作成されるのを防ぎます
const prisma = globalThis.prisma || new PrismaClient();

// 開発環境で実行されている場合、
// 作成した PrismaClient インスタンスを globalThis.prisma に割り当てます。
// こうすることで、同じインスタンスが再利用されます
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export { prisma };