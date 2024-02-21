import { prisma } from "@/lib/prisma";

export const createVerificationToken = ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  const now = new Date();
  return prisma.verificationToken.create({
    data: {
      identifier: email,
      token: token,
      // トークンの有効期限は24時間
      expires: new Date(now.getTime() + 24 * 60 * 60 * 1000),
    },
  });
};

export const getVerificationTokenByToken = ({ token }: { token: string }) => {
  const now = new Date();
  return prisma.verificationToken.findUnique({
    where: { token: token, expires: { gt: now } },
  });
};

export const getPasswordResetTokenByToken = ({ token }: { token: string }) => {
  const now = new Date();
  return prisma.passwordResetToken.findUnique({
    where: { token: token, expires: { gt: now } },
  });
};

export const deleteVerificationTokenByIdentifier = ({
  identifier,
}: {
  identifier: string;
}) => {
  return prisma.verificationToken.deleteMany({
    where: { identifier: identifier },
  });
};