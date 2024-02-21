import React from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { signOut } from "next-auth/react";

export const LogoutButton = () => {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="w-full flex justify-start text-base font-normal"
          variant={"link"}
        >
          Logout
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[420px] p-8">
        <DialogHeader>
          <DialogTitle>Logout</DialogTitle>
          <DialogDescription>ログアウトしますか？</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4"></div>
        <DialogFooter>
          <div className="w-full flex flex-col space-y-4">
            <Button
              onClick={handleLogout}
              className="w-full"
              variant={"default"}
            >
              はい
            </Button>
            <DialogClose asChild>
              <Button className="w-full" variant={"outline"}>
                いいえ
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
