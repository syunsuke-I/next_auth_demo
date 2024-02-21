import { prisma } from "@/lib/prisma";

export const upsertPasswordResetToken = ({
  userId,
  token,
}: {
  userId: string;
  token: string;
}) => {
  const now = new Date();
  console.log(`now = ${now}`);
  return prisma.passwordResetToken.upsert({
    where: { userId: userId },
    update: {
      token: token,
      // トークンの有効期限は24時間
      expires: new Date(now.getTime() + 24 * 60 * 60 * 1000),
    },
    create: {
      token: token,
      // トークンの有効期限は24時間
      expires: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      userId: userId,
    },
  });
};

export const getPasswordResetToken = ({ token }: { token: string }) => {
  const now = new Date();
  return prisma.passwordResetToken.findUnique({
    where: { token: token, expires: { gt: now } },
  });
};

export const getPasswordResetTokenWithUser = ({ token }: { token: string }) => {
  const now = new Date();
  return prisma.passwordResetToken.findUnique({
    where: { token: token, expires: { gt: now } },
    include: { user: true },
  });
};

export const deleteResetPasswordTokenByUserId = ({
  userId,
}: {
  userId: string;
}) => {
  return prisma.passwordResetToken.delete({ where: { userId: userId } });
};