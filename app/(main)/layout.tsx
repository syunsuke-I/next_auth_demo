import { Sidenav } from "@/components/nav/Sidenav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <div className="">
        <Sidenav />
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}