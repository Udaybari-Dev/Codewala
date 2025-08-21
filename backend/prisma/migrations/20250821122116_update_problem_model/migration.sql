/*
  Warnings:

  - The `constraints` column on the `Problem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `language` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `solutionCode` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Problem" ADD COLUMN     "language" TEXT NOT NULL,
ADD COLUMN     "solutionCode" JSONB NOT NULL,
DROP COLUMN "constraints",
ADD COLUMN     "constraints" TEXT[];
