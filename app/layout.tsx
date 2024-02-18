import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthContext } from "@/contexts/AuthContext";
import { ImKey } from "react-icons/im";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";
import { ErrorToaster } from "@/components/common/ErrorToaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "認証の達人",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${inter.className} p-12 h-screen`}>
        <div className="space-y-2 pb-8">
          <div className="">
            <Link className="flex items-center space-x-1 text-2xl" href={"/"}>
              <ImKey />
              <h1 className="text-2xl font-bold text-gray-900">認証の達人</h1>
            </Link>
          </div>
          <p className="text-lg text-gray-700">
            Next.jsとNextAuthで学ぶセキュリティ
          </p>
        </div>
        <Separator />
        <div className="pt-4">
          <AuthContext>{children}</AuthContext>
        </div>
        <Toaster />
        <ErrorToaster />
      </body>
    </html>
  );
}