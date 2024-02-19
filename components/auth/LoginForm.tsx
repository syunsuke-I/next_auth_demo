"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle,CardDescription } from "@/components/ui/card";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export const LoginCard = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // GitHub でログイン
  const handleLoginGithub = async () => {
    try {
      const result = await signIn("github", { callbackUrl: "/" });
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
    <Card className="w-[540px] flex flex-col items-center justify-center p-8">
      <CardHeader>
        <CardTitle className="mx-auto">Login</CardTitle>
        <CardDescription>ログインして学習を開始しましょう！</CardDescription>
      </CardHeader>
      <CardContent className="w-full flex items-center justify-center">
        <Button
          className="space-x-1"
          variant={"outline"}
          onClick={() => handleLoginGithub()}
        >
          <FaGithub />
          <div>GitHub</div>         
        </Button>
      </CardContent>
    </Card>
  );
};