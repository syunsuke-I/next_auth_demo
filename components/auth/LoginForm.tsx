"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Link from "next/link";
import { LiaSpinnerSolid } from "react-icons/lia";

export const LoginForm = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // GitHub でログイン
  const handleSocialLogin = async (socialName: string) => {
    setIsLoading(true);
    try {
      const result = await signIn(socialName, { callbackUrl: "/" });
      if (result?.error) {
        toast({
          variant: "destructive",
          title: "ログインに失敗しました",
          description: result.error,
        });
      }
    } catch (error) {
      let message;
      if (error instanceof Error) {
        message = error.message;
      }
      toast({
        variant: "destructive",
        title: "ログインに失敗しました",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // メールアドレスでログイン
  const handleLoginEmail = async () => {
    setIsLoading(true);
    try {
      if (email === "" || password === "") {
        toast({
          variant: "destructive",
          title: "メールアドレスとパスワードを入力してください",
        });
        return;
      }
      const result = await signIn("credentials", {
        email: email,
        password: password,
        callbackUrl: "/",
      });
      if (result?.error) {
        toast({
          variant: "destructive",
          title: "ログインに失敗しました",
          description: result.error,
        });
      }
    } catch (error) {
      let message;
      if (error instanceof Error) {
        message = error.message;
      }
      toast({
        variant: "destructive",
        title: "ログインに失敗しました",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[540px] flex flex-col items-center justify-center p-8 px-12">
      <CardHeader>
        <CardTitle className="mx-auto">Login</CardTitle>
        <CardDescription>ログインして学習を開始しましょう！</CardDescription>
      </CardHeader>
      <CardContent className="w-full space-y-8">
        <div className="grid grid-cols-2 gap-6">
          <Button
            disabled={isLoading}
            className="space-x-1"
            variant={"outline"}
            onClick={() => handleSocialLogin("github")}
          >
            <FaGithub />
            <div>GitHub</div>
          </Button>
          <Button
          disabled={isLoading}
          className="space-x-1"
          variant={"outline"}
          onClick={() => handleSocialLogin("google")}
          >
          <FaGoogle />
          <div>Google</div>
        </Button>        
        </div>
        <Separator />
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              type="email"
              placeholder="user@example.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              type="password"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="w-full flex flex-col space-y-4">
        <Button
          disabled={isLoading}
          onClick={handleLoginEmail}
          className="w-full space-x-1"
        >
          {isLoading && <LiaSpinnerSolid className="animate-spin text-xl" />}
          <span>Login</span>
        </Button>
        <div className="w-full flex justify-between">
          <Link className="hover:underline" href="/auth/signup">
            Create Account
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};