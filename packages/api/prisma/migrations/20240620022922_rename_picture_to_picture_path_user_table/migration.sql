/*
  Warnings:

  - You are about to drop the column `picture` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "picture",
ADD COLUMN     "picture_path" TEXT;

-- RenameForeignKey
ALTER TABLE "posts" RENAME CONSTRAINT "posts_authorId_fkey" TO "posts_author_id_fkey";
