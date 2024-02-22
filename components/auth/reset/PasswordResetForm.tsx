"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LiaSpinnerSolid } from "react-icons/lia";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { fetchEmailByPasswordResetToken, submitNewPassword } from "./actions";

const schema = z
  .object({
    password: z
    .string()
    .min(8, "パスワードは最低8文字必要です。")
    .regex(/[a-z]/, "パスワードには少なくとも1つの小文字が必要です。")
    .regex(/[A-Z]/, "パスワードには少なくとも1つの大文字が必要です。")
    .regex(/[0-9]/, "パスワードには少なくとも1つの数字が必要です。")
    .regex(
      /[^a-zA-Z0-9]/,
      "パスワードには少なくとも1つの特殊文字が必要です。"
    ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードと確認用パスワードが一致しません。",
    path: ["confirmPassword"], // エラーメッセージは confirmPassword に表示する
  });

type InputType = z.infer<typeof schema>;

export const PasswordResetForm = () => {
  // ローディング状態とエラーメッセージのステート
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // sessionStorageのreset_tokenを利用してメールアドレスを取得し、tokenにセットします
    const fetchToken = async () => {
      // リセットトークン入力画面で sessionStorage に保存したトークンを取得します
      const resetToken = sessionStorage.getItem("reset_token");
      if (!resetToken) {
        toast({ variant: "destructive", title: "トークンが取得できません" });
        return;
      }
      // resetTokenをtokenにセット
      setToken(resetToken);
      try {
        // resetTokenからemailを取得します
        const email = await fetchEmailByPasswordResetToken({
          token: resetToken,
        });
        if (!email) {
          throw new Error("不正なトークンです。");
        }
        setEmail(email);
      } catch (error) {
        if (error instanceof Error) {
          toast({ variant: "destructive", title: error.message });
        } else {
          toast({
            variant: "destructive",
            title: "サーバーでエラーが発生しました",
          });
        }
      }
    };
    fetchToken();
  }, []);

  // react-hook-formとzodを使用したバリデーション
  const form = useForm<InputType>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // フォーム送信時の処理
  const onSubmit: SubmitHandler<InputType> = async (data) => {
    setIsLoading(true);
    setErrMsg("");
    try {
      await submitNewPassword({
        token: token,
        password: data.password,
      });
      toast({ variant: "default", title: "パスワードをリセットしました" });
      router.push("/login");
    } catch (error) {
      if (error instanceof Error) {
        setErrMsg(error.message);
      } else {
        setErrMsg("エラーが発生しました");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[540px] flex flex-col items-center justify-center p-8 px-12">
      <CardHeader>
        <CardTitle className="mx-auto">Password Reset Form</CardTitle>
        <CardDescription>
          新しいパスワードを以下に入力してください。
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full space-y-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>メールアドレス</Label>
              <Input disabled defaultValue={email} />
            </div>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>新しいパスワード</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>確認用パスワード</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4">
              <Button disabled={isLoading} className="w-full space-x-1">
                {isLoading && (
                  <LiaSpinnerSolid className="animate-spin text-xl" />
                )}
                <span>確認</span>
              </Button>
              {/* エラーメッセージ */}
              <p className="mt-2 text-sm text-red-500">{errMsg}</p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};