/*
  Warnings:

  - You are about to drop the `Jogador` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Jogador" DROP CONSTRAINT "Jogador_idTime_fkey";

-- DropTable
DROP TABLE "Jogador";

-- CreateTable
CREATE TABLE "jogadores" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "numeroCamisa" INTEGER NOT NULL,
    "idTime" INTEGER NOT NULL,
    "genero" TEXT NOT NULL,
    "altura" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "jogadores_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "jogadores" ADD CONSTRAINT "jogadores_idTime_fkey" FOREIGN KEY ("idTime") REFERENCES "times"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
