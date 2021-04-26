-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('EMAIL', 'DEFAULT');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tokenType" "TokenType" NOT NULL,
    "shortId" TEXT,
    "owner" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Token" ADD FOREIGN KEY ("owner") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;
