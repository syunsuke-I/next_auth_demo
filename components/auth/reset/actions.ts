"use server";

import {
  sendEmailAlertPasswordReset,
  sendEmailWithPasswordResetToken,
} from "@/feature/email/sendEmail";
import {
  deleteResetPasswordTokenByUserId,
  getPasswordResetToken,
  getPasswordResetTokenWithUser,
  upsertPasswordResetToken,
} from "@/feature/store/passwordResetToken";
import { getUserByEmail, updateUser } from "@/feature/store/user";
import { generateToken } from "@/feature/utils/util";
import { PasswordResetToken, User } from "@prisma/client";
import bcrypt from "bcrypt";

export const submitResetTokenRequest = async ({ email }: { email: string }) => {
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

  // ユーザーが存在しない場合は、
  // もしくはEmail以外でログインしている場合は
  // 何もせずに処理を終了する
  if (!user || !user.password) {
    console.log(`存在しないユーザーです: ${email}`);
    return;
  }

  // パスワードリセット用のトークンを生成し、データベースに保存します。
  const token = generateToken(8);
  try {
    await upsertPasswordResetToken({ userId: user.id, token: token });
  } catch (error) {
    console.error(error);
    throw new Error(
      "データベースにエラーが発生しました。管理者に問い合わせてください。"
    );
  }

  // メールアドレスにパスワードリセットトークンを含むメールを送信します。
  try {
    await sendEmailWithPasswordResetToken({
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

export const verifyResetToken = async ({ token }: { token: string }) => {
  // リセットトークンがDBに存在するか確認します。
  // 存在しない場合やDBにアクセス中にエラーが発生した場合は、エラーを投げます
  let passwordResetToken: PasswordResetToken | null;
  try {
    passwordResetToken = await getPasswordResetToken({ token });
  } catch (error) {
    console.error(error);
    throw new Error(
      "データベースにエラーが発生しました。管理者に問い合わせてください。"
    );
  }
  if (!passwordResetToken) {
    console.log("トークンが存在しません");
    throw new Error("入力されたトークンが無効です。再度確認してください");
  }

  // 処理が完了したら、次のステップに進みます
  return;
};

export const fetchEmailByPasswordResetToken = async ({
  token,
}: {
  token: string;
}) => {
  // パスワードリセットトークンとそれに紐づくユーザーをDBから取得します
  let resetToken: (PasswordResetToken & { user: User }) | null;
  try {
    resetToken = await getPasswordResetTokenWithUser({ token });
  } catch (error) {
    console.error(error);
    throw new Error(
      "データベースにエラーが発生しました。管理者に問い合わせてください。"
    );
  }

  // トークンが存在しない場合のエラーハンドリング
  if (!resetToken) {
    throw new Error("有効なトークンがありません");
  }

  // トークンに紐づくユーザーのメールアドレスを返します
  return resetToken.user.email;
};

export const submitNewPassword = async ({
  token,
  password,
}: {
  token: string;
  password: string;
}) => {
  // パスワードリセットトークンとそれに紐づくユーザーをDBから取得します
  let resetToken: (PasswordResetToken & { user: User }) | null;
  try {
    resetToken = await getPasswordResetTokenWithUser({ token });
  } catch (error) {
    console.error(error);
    throw new Error(
      "データベースにエラーが発生しました。管理者に問い合わせてください。"
    );
  }
  // トークンが存在しない場合のエラーハンドリング
  if (!resetToken) {
    throw new Error("有効なトークンがありません");
  }
  if (!resetToken.user.password) {
    throw new Error(
      "ユーザーにパスワードが設定されていません。別のログインを試してください"
    );
  }

  // 既存のパスワードと新しいパスワードが異なることを確認します。
  const isMatched = await bcrypt.compare(password, resetToken.user.password);
  if (isMatched) {
    throw new Error(
      "新しいパスワードは古いパスワードとは別のパスワードを設定してください"
    );
  }

  // 新しいパスワードをハッシュ化し、ユーザーのパスワードを更新します。
  const hashedPassword = await bcrypt.hash(password, 12);
  try {
    await updateUser({ userId: resetToken.userId, password: hashedPassword });
  } catch (error) {
    console.error(error);
    throw new Error(
      "データベースにエラーが発生しました。管理者に問い合わせてください。"
    );
  }

  // パスワードの更新が完了したら、使用済みのパスワードリセットトークンを削除します。
  try {
    await deleteResetPasswordTokenByUserId({ userId: resetToken.userId });
  } catch (error) {
    console.error(token);
  }

  // パスワードがリセットされたことをユーザーに通知します
  try {
    if (!resetToken.user.email) {
      throw new Error("Emailの存在しないユーザーのパスワードを変更しました");
    }
    await sendEmailAlertPasswordReset({ email: resetToken.user.email });
  } catch (error) {
    console.error(error);
  }

  // 処理が完了したら、次のステップに進みます。
  return;
};
