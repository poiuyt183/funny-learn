-- AlterTable
ALTER TABLE "child_profile" ADD COLUMN     "interests" TEXT[],
ADD COLUMN     "personality" TEXT[];

-- CreateTable
CREATE TABLE "mascot" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "traits" TEXT[],

    CONSTRAINT "mascot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "child_profile" ADD CONSTRAINT "child_profile_mascotId_fkey" FOREIGN KEY ("mascotId") REFERENCES "mascot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
