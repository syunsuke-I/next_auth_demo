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
import { fetchClientVerificationToken, submitNewUserRequest } from "./actions";
import { LiaSpinnerSolid } from "react-icons/lia";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { VerificationToken } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

const schema = z
  .object({
    name: z.string().min(1, "このフィールドは必須です。"),
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

export const CreateUserForm = () => {
  // ローディング状態とエラーメッセージのステート
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [verificationToken, setVerificationToken] =
    useState<VerificationToken | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // tokenからメールアドレスを取得し、verificationTokenにセットします
    const fetchToken = async () => {
      // トークン検証画面で sessionStorage に保存したトークンを取得します
      const verifyToken = sessionStorage.getItem("verify_token");
      if (!verifyToken) {
        toast({ variant: "destructive", title: "トークンが取得できません" });
        return;
      }
      try {
        // トークンからVerificationTokenを取得します
        const token = await fetchClientVerificationToken({
          token: verifyToken,
        });
        setVerificationToken(token);
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
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  // フォーム送信時の処理
  const onSubmit: SubmitHandler<InputType> = async (data) => {
    setIsLoading(true);
    setErrMsg("");

    try {
      if (!verificationToken) {
        setErrMsg("エラーが発生しました");
        return;
      }
      // ユーザーの新規作成をリクエストします
      await submitNewUserRequest({
        token: verificationToken.token,
        name: data.name,
        password: data.password,
      });
      toast({ variant: "default", title: "ユーザーを作成しました" });
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
        <CardTitle className="mx-auto">Create New Account</CardTitle>
        <CardDescription>
          新しいアカウントを作成しましょう。以下のフォームに必要な情報を入力して、サービスを始める準備を進めてください。
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full space-y-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
	      {/* メールアドレスは verificationToken から取得し、変更できないようにしています */}
              <Label>メールアドレス</Label>
              <Input disabled defaultValue={verificationToken?.identifier} />
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>名前</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>パスワード</FormLabel>
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