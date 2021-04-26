/*
  Warnings:

  - Added the required column `ownerUsername` to the `Business` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "ownerUsername" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "pwd" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("username")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Business" ADD FOREIGN KEY ("ownerUsername") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;
