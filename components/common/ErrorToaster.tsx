"use client";

import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const errorMessages = {
  OAuthAccountNotLinked:
    "このメールアドレスは別のログイン方法で既に登録されています。以前に使用したログイン方法をお試しください。",
  InvalidCredentials: "メールアドレス・パスワードが正しくありません",
  loginRequired: "ログインが必要です",
};

export const ErrorToaster = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      const errorMessage =
        errorMessages[error as keyof typeof errorMessages] ||
        "エラーが発生しました";
      toast({
        variant: "destructive",
        title: errorMessage,
      });
    }
  }, [error, toast]);

  return null;
};