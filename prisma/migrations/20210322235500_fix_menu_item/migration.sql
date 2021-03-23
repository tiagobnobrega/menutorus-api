/*
  Warnings:

  - Added the required column `title` to the `MenuItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "title" VARCHAR(80) NOT NULL,
ALTER COLUMN "abstract" SET DATA TYPE VARCHAR(140);
