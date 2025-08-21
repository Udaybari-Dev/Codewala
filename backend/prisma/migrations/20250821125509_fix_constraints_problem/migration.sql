-- AlterTable
ALTER TABLE "public"."Problem" ALTER COLUMN "constraints" SET NOT NULL,
ALTER COLUMN "constraints" SET DATA TYPE TEXT;
