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
import { sendVerificationToken } from "./actions";
import { LiaSpinnerSolid } from "react-icons/lia";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z
    .string()
    .email({ message: "有効なメールアドレスの形式ではありません" }),
});

type InputType = z.infer<typeof schema>;

export const EmailSignupForm = () => {
  // ローディング状態とエラーメッセージのステート
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  // react-hook-formとzodを使用したバリデーション
  const form = useForm<InputType>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  // フォーム送信時の処理
  const onSubmit: SubmitHandler<InputType> = async (data) => {
    setIsLoading(true);
    setErrMsg("");
    try {
      // 登録されたメールアドレスに検証用トークンを送信
      await sendVerificationToken({ email: data.email });
      toast({
        variant: "default",
        title: "メールアドレス宛にメッセージを送信しました",
      });

      // トークンが送信されたら /auth/signup/token へ遷移する
      router.push("/auth/signup/token");
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* メールアドレス入力フィールド */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="user@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 送信ボタン */}
        <div>
          <Button disabled={isLoading} className="w-full space-x-1">
            {isLoading && <LiaSpinnerSolid className="animate-spin text-xl" />}
            <span>メールアドレスで登録</span>
          </Button>
          {/* エラーメッセージ */}
          <p className="mt-2 text-sm text-red-500">{errMsg}</p>
        </div>
      </form>
    </Form>
  );
};