import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();
  // sessionが存在する場合は、メインページへリダイレクト
  if (session) {
    redirect("/");
  }
  return <>{children}</>;
}