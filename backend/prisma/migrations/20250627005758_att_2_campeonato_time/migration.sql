/*
  Warnings:

  - Added the required column `nomeCampeonato` to the `campeonato_time` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomeTime` to the `campeonato_time` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "campeonato_time" ADD COLUMN     "nomeCampeonato" TEXT NOT NULL,
ADD COLUMN     "nomeTime" TEXT NOT NULL;
