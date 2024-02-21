"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
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
import { useRouter } from "next/navigation";
import { verifyResetToken } from "./actions";

const schema = z.object({
  token: z.string().min(1, "入力必須です"),
});

type InputType = z.infer<typeof schema>;

export const ResetTokenInput = () => {
  // ローディング状態とエラーメッセージのステート
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const router = useRouter();

  // react-hook-formとzodを使用したバリデーション
  const form = useForm<InputType>({
    resolver: zodResolver(schema),
    defaultValues: {
      token: "",
    },
  });

  // フォーム送信時の処理
  const onSubmit: SubmitHandler<InputType> = async (data) => {
    setIsLoading(true);
    setErrMsg("");

    // 入力されたトークンは sessionStorage に保存し、
    // パスワードの入力画面で利用します
    sessionStorage.setItem("reset_token", data.token);

    try {
      // 入力されたトークンの検証をリクエストします
      await verifyResetToken({ token: data.token });
      router.push("/auth/reset/reset_password");
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
        <CardTitle className="mx-auto">Password Reset</CardTitle>
        <CardDescription>
          ご登録のメールアドレスに送信された
          <br />
          トークンを以下に入力してください
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full space-y-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>リセットトークン</FormLabel>
                  <FormControl>
                    <Input placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
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
