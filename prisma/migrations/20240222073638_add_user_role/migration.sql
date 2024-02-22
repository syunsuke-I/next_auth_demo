-- CreateEnum
CREATE TYPE "UserRoleType" AS ENUM ('Staff', 'Manager');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRoleType" NOT NULL DEFAULT 'Staff';
