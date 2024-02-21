import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <main className="flex flex-col items-center space-y-4">
      <p>hello world</p>
      <Button asChild>
        <Link href="/login">ログイン</Link>
      </Button>
    </main>
  );
}