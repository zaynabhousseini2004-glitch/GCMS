-- AlterTable
ALTER TABLE "seat_assignments" ADD COLUMN     "guestName" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;
