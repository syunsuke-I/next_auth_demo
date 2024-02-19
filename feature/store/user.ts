import { prisma } from "@/lib/prisma";

export const getUserByEmail = async ({ email }: { email: string }) => {
  return await prisma.user.findUnique({ where: { email: email } });
};

export const createUser = ({
  email,
  name,
  password,
  emailVerified,
}: {
  email: string;
  name: string;
  password: string;
  emailVerified?: Date;
}) => {
  return prisma.user.create({ data: { name, email, password, emailVerified } });
};