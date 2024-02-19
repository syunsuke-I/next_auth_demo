import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/prisma";
import GitHubProvider from "next-auth/providers/github";
import { getServerSession } from "next-auth"

import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

// NextAuthの設定
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        // ユーザーが入力する認証情報
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        // credentialsがない場合、エラーを返す
        if (!credentials?.email || !credentials.password) {
          throw new Error("InvalidCredentials");
        }

        // メールアドレスをもとにユーザーを取得する
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // ユーザーが存在しない、
        // またはパスワードが未設定の場合エラーを返す
        // （GitHubなど他のログインを利用している場合パスワードが未設定になります）
      if (!user || !user.password) {
          throw new Error("InvalidCredentials");
        }

        // パスワードの比較 
        const isMatched = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isMatched) {
          throw new Error("InvalidCredentials");
        }
        return user;
      },
    }),    
  ],
  session: {
    // セッションはJWTとして管理する
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    redirect: ({ url, baseUrl }) => {
      // urlが相対パス（例えば/dashboard)の時、
      // baseUrl(http://localhost:3000)と結合して完全なURL(http://localhost:3000/dashboard)を返す
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // urlのオリジンがbaseUrlと同じ場合、urlを返す
      else if (new URL(url).origin === baseUrl) return url;
 
      // urlのオリジンがbaseUrlではない=>外部サイトの場合、
      // 安全性を考慮してbaseUrlに返す
      return baseUrl;
    },    
  },
  pages: {},
};

export const getAuthSession = async () => {
  return getServerSession(authOptions);
 };