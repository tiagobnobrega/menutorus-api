/*
  Warnings:

  - Added the required column `title` to the `MenuSection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `MenuSection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MenuSection" ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "order" INTEGER NOT NULL;
