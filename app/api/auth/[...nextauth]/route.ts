import { authOptions } from "@/lib/nextauth";
import NextAuth from "next-auth/next";

// NextAuthハンドラーを作成
// 作成したauthOptionsの設定が反映される
const handler = NextAuth(authOptions);

// handlerをGETとPOSTリクエストの両方に対してエクスポートする
// これにより認証に関するGETとPOSTのリクエストを同じハンドラーで処理できる
export { handler as GET, handler as POST };
