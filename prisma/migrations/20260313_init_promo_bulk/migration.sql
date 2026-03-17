-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "promoCode" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromoTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startMark" TEXT NOT NULL,
    "endMark" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromoTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromoBatch" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "appliedCount" INTEGER NOT NULL,
    "failedCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rolledBack" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PromoBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromoApplication" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "originalContent" TEXT NOT NULL,
    "newContent" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "PromoApplication_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PromoBatch" ADD CONSTRAINT "PromoBatch_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "PromoTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromoApplication" ADD CONSTRAINT "PromoApplication_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromoApplication" ADD CONSTRAINT "PromoApplication_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "PromoBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

