/*
  Warnings:

  - A unique constraint covering the columns `[telegramId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Branch` table without a default value. This is not possible if the table is not empty.
  - Made the column `lat` on table `Branch` required. This step will fail if there are existing NULL values in that column.
  - Made the column `long` on table `Branch` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "OrganizationStructure" AS ENUM ('MCHJ', 'YATT', 'AJ', 'XK', 'QK', 'NNT', 'DM', 'DUK', 'MU', 'FILIAL');

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'DIRECTOR';

-- AlterTable
ALTER TABLE "Branch" ADD COLUMN     "code" INTEGER NOT NULL,
ALTER COLUMN "lat" SET NOT NULL,
ALTER COLUMN "long" SET NOT NULL;

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "inn" INTEGER,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "orgStructure" "OrganizationStructure" NOT NULL DEFAULT 'MCHJ';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "passwordSalt" TEXT,
ADD COLUMN     "telegramId" TEXT;

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON "RefreshToken"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramId_key" ON "User"("telegramId");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
