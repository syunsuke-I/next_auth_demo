"use server";

import { sendEmailWithVerificationToken } from "@/feature/email/sendEmail";
import { createUser, getUserByEmail } from "@/feature/store/user";
import {
  createVerificationToken,
  deleteVerificationTokenByIdentifier,
  getVerificationTokenByToken,
} from "@/feature/store/verificationToken";
import { generateToken } from "@/feature/utils/util";
import { User, VerificationToken } from "@prisma/client";
import bcrypt from "bcrypt";

export const sendVerificationToken = async ({ email }: { email: string }) => {
  // メールアドレスをもとに既存のユーザーが存在するか確認します。
  let user: User | null;
  try {
    user = await getUserByEmail({ email: email });
  } catch (error) {
    console.error(error);
    throw new Error(
      "データベースにエラーが発生しました。管理者に問い合わせてください。"
    );
  }

  // メールアドレスが既に使用されている場合、処理を中断し、
  // ユーザーにエラーメッセージを返します
  if (user !== null) {
    console.log("メールアドレスはすでに使用されています。");
    throw new Error(
      "このメールアドレスは既に使用されています。別のメールアドレスを使用するか、ログインページからアカウントにアクセスしてください。"
    );
  }

  // 新規ユーザーに対して検証用トークンを作成し、DBに保存します
  // このトークンはユーザーがメールアドレスを所有しているか確認するために使用します
  const token = generateToken(8);

  let verificationToken: VerificationToken;
  try {
    verificationToken = await createVerificationToken({
      email: email,
      token: token,
    });
  } catch (error) {
    console.error(error);
    throw new Error(
      "データベースにエラーが発生しました。管理者に問い合わせてください。"
    );
  }

  // 作成した検証用トークンをユーザーのメールアドレスに送信します。
  try {
    const info = await sendEmailWithVerificationToken({
      email: email,
      token,
    });
  } catch (error) {
    console.error(error);
    throw new Error(
      "メールを送信することができませんでした。しばらくしてから再度お試しください。"
    );
  }

  // 処理が完了したら、次のステップに進みます
  return;
};

export const verifyToken = async ({ token }: { token: string }) => {
  // 検証トークンがDBに存在するか確認します。
  // 存在しない場合やDBにアクセス中にエラーが発生した場合は、エラーを投げます
  let verificationToken: VerificationToken | null;
  try {
    verificationToken = await getVerificationTokenByToken({ token });
  } catch (error) {
    console.error(error);
    throw new Error(
      "データベースにエラーが発生しました。管理者に問い合わせてください。"
    );
  }
  if (!verificationToken) {
    console.log("トークンが存在しません");
    throw new Error("入力されたトークンが無効です。再度確認してください");
  }
  
  // 処理が完了したら、次のステップに進みます
  return;
};

// クライアントから提供されたトークンを使って、対応する検証トークンをデータベースから取得します。
export const fetchClientVerificationToken = async ({
  token,
}: {
  token: string;
}) => {
  try {
    return await getVerificationTokenByToken({ token });
  } catch (error) {
    console.error(error);
    throw new Error(
      "データベースにエラーが発生しました。管理者に問い合わせてください。"
    );
  }
};

// 新しいユーザーの作成リクエストを処理します。
export const submitNewUserRequest = async ({
  token,
  name,
  password,
}: {
  token: string;
  name: string;
  password: string;
}) => {
  // 検証トークンがDBに存在するか確認します。
  // 存在しない場合やDBにアクセス中にエラーが発生した場合は、エラーを投げます
  let verificationToken: VerificationToken | null;
  try {
    verificationToken = await getVerificationTokenByToken({
      token: token,
    });
  } catch (error) {
    console.error(error);
    throw new Error(
      "データベースにエラーが発生しました。管理者に問い合わせてください。"
    );
  }

  if (!verificationToken) {
    console.log("トークンが存在しません。");
    throw new Error("トークンが取得できません。");
  }

  // ユーザーの新規作成
  // パスワードはハッシュ化してDBに保存します
  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    await createUser({
      email: verificationToken.identifier,
      name: name,
      password: hashedPassword,
      emailVerified: new Date(),
    });
  } catch (error) {
    console.error(error);
    throw new Error(
      "データベースにエラーが発生しました。管理者に問い合わせてください。"
    );
  }

  // 使用済みトークンを削除
  try {
    await deleteVerificationTokenByIdentifier({
      identifier: verificationToken.identifier,
    });
  } catch (error) {
    console.error(token);
  }

  // 処理が完了したら、次のステップに進みます
  return;
};