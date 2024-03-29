"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { EmailSignupForm } from "./EmailSignupForm";

export const SignupForm = () => {
  const { toast } = useToast();

  // ソーシャルログイン
  const handleSocialLogin = async (socialName: string) => {
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
    }
  };

  return (
    <Card className="w-[540px] flex flex-col items-center justify-center p-8 px-12">
      <CardHeader>
        <CardTitle className="mx-auto">Signup</CardTitle>
        <CardDescription>
          ユーザー登録して学習を開始しましょう！
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full space-y-8">
        <div className="grid grid-cols-2 gap-6">
          <Button
            className="space-x-1"
            variant={"outline"}
            onClick={() => handleSocialLogin("github")}
          >
            <FaGithub />
            <div>GitHubで登録</div>
          </Button>
          <Button
            className="space-x-1"
            variant={"outline"}
            onClick={() => handleSocialLogin("google")}
          >
            <FaGoogle />
            <div>Googleで登録</div>
          </Button>
        </div>
        <Separator />
        <EmailSignupForm />
      </CardContent>
    </Card>
  );
};
