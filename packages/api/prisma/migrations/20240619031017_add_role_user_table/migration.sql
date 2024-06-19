-- CreateEnum
CREATE TYPE "Role" AS ENUM ('WRITER', 'ADMIN');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'WRITER';
