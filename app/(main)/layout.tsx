import { Sidenav } from "@/components/nav/Sidenav";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
 }: {
  children: React.ReactNode;
 }) {
  const session = await getAuthSession();
  // session が存在しない場合、ログイン画面へリダイレクト
  if (!session) {
    redirect("/login?error=loginRequired");
  }
  return (
    <div className="flex">
      <div className="">
        <Sidenav />
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}