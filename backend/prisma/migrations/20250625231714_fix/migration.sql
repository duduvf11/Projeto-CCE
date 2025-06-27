/*
  Warnings:

  - The `timeA` column on the `Jogo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `timeB` column on the `Jogo` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Jogo" DROP COLUMN "timeA",
ADD COLUMN     "timeA" INTEGER,
DROP COLUMN "timeB",
ADD COLUMN     "timeB" INTEGER;
