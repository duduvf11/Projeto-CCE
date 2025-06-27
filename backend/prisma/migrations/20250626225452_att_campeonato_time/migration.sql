/*
  Warnings:

  - Added the required column `usuarioId` to the `campeonato_time` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "campeonato_time" ADD COLUMN     "usuarioId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "campeonato_time" ADD CONSTRAINT "campeonato_time_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
