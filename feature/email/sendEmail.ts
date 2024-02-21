import nodemailer from "nodemailer";

// メール本文にコードのタブが反映されないようにタブ文字を置き換えます。
const removeIndent = (str: string): string => {
  return str.replace(/^[ \t]+/gm, "");
};

export const sendEmailWithVerificationToken = ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  const subject = `メールアドレスの確認が必要です`;

  const body =
    removeIndent(`Next-Auth-APPへの登録ありがとうございます。アカウントの確認を完了するために、以下の検証用トークンを指定された場所に入力してください。
    \n
    検証用トークン: ${token}
    \n
    このトークンは次の24時間でのみ有効です。トークンが期限切れになった場合は、アプリ内でメールアドレス検証のプロセスを再開して新しいトークンを要求してください。`);

  return sendEmail({ to: email, subject: subject, text: body });
};

export const sendEmail = async ({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) => {
  return sendEmailWithMailHog({ to, subject, text });
};

const sendEmailWithMailHog = async ({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) => {
  // MailHog SMTPサーバーの設定
  const transporter = nodemailer.createTransport({
    host: "localhost", // MailHogが実行されているホスト
    port: 1025, // MailHogのデフォルトSMTPポート
    secure: false, // ローカル開発のため、TLSは不要
  });

  const mailOptions = {
    from: "Next-Auth-App <auth-app@example.com>", // 送信者アドレス
    to: to, // 受信者アドレス
    subject: subject, // メールの件名
    text: text, // メールの本文
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

export const sendEmailAlertPasswordReset = ({
  email,
}: {
  email: string;
}) => {
  const now = new Date();
  const subject = `パスワードをリセットしました`;
  const body = removeIndent(
    `あなたのアカウントのパスワードが正常にリセットされました。この変更は ${now.toLocaleString()} に行われました。
    もしこのパスワードリセットを行っていない場合、またはこの変更について心当たりがない場合は、すぐにアカウントのセキュリティを確認し、サポートチームに連絡してください。
    `
  );

  return sendEmail({ to: email, subject: subject, text: body });
};

export const sendEmailWithPasswordResetToken = ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  const subject = `パスワードリセットのリクエストを受け付けました`;
  const body =
    removeIndent(`あなたのアカウントのパスワードリセットのリクエストを受け取りました。リセットを行うために、以下のリセットトークンを指定された場所に入力してください
  \n
  リセットトークン: ${token}
  \n
  このトークンは次の24時間でのみ有効です。
  このリクエストの覚えがない場合は、このメッセージを無視してください。`);

  return sendEmail({ to: email, subject: subject, text: body });
};