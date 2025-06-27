/*
  Warnings:

  - The values [SUICO] on the enum `Formato` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "StatusJogo" AS ENUM ('PENDENTE', 'EM_ANDAMENTO', 'FINALIZADO');

-- CreateEnum
CREATE TYPE "Eventos" AS ENUM ('GOL', 'CARTA_AMARELO', 'CARTAO_VERMELHO');

-- AlterEnum
BEGIN;
CREATE TYPE "Formato_new" AS ENUM ('MATA_MATA', 'GRUPO', 'MATA_MATA_CHAVEAMENTO');
ALTER TABLE "campeonatos" ALTER COLUMN "formato" TYPE "Formato_new" USING ("formato"::text::"Formato_new");
ALTER TYPE "Formato" RENAME TO "Formato_old";
ALTER TYPE "Formato_new" RENAME TO "Formato";
DROP TYPE "Formato_old";
COMMIT;

-- CreateTable
CREATE TABLE "Jogo" (
    "id" SERIAL NOT NULL,
    "campeonatoId" INTEGER NOT NULL,
    "timeA" TEXT,
    "timeB" TEXT,
    "horario" TIMESTAMP(3),
    "status" "StatusJogo" NOT NULL,
    "jogo" INTEGER NOT NULL,
    "fase" INTEGER NOT NULL,
    "golsA" INTEGER NOT NULL DEFAULT 0,
    "golsB" INTEGER NOT NULL DEFAULT 0,
    "vencedor" INTEGER NOT NULL,
    "estatisticaAId" INTEGER,
    "estatisticaBId" INTEGER,

    CONSTRAINT "Jogo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JogadoresEmCampo" (
    "id" SERIAL NOT NULL,
    "jogadorId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "jogoId" INTEGER NOT NULL,

    CONSTRAINT "JogadoresEmCampo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Estatistica" (
    "id" SERIAL NOT NULL,
    "assistencias" INTEGER NOT NULL DEFAULT 0,
    "finalizacoes" INTEGER NOT NULL DEFAULT 0,
    "faltas" INTEGER NOT NULL DEFAULT 0,
    "cartaoAmarelo" INTEGER NOT NULL DEFAULT 0,
    "cartaoVermelho" INTEGER NOT NULL DEFAULT 0,
    "penaltis" INTEGER NOT NULL DEFAULT 0,
    "escanteios" INTEGER NOT NULL DEFAULT 0,
    "impedimentos" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Estatistica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evento" (
    "id" SERIAL NOT NULL,
    "jogoId" INTEGER NOT NULL,
    "jogadorId" INTEGER NOT NULL,
    "tipoEvento" "Eventos" NOT NULL,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Jogo" ADD CONSTRAINT "Jogo_estatisticaAId_fkey" FOREIGN KEY ("estatisticaAId") REFERENCES "Estatistica"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jogo" ADD CONSTRAINT "Jogo_estatisticaBId_fkey" FOREIGN KEY ("estatisticaBId") REFERENCES "Estatistica"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JogadoresEmCampo" ADD CONSTRAINT "JogadoresEmCampo_jogoId_fkey" FOREIGN KEY ("jogoId") REFERENCES "Jogo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_jogadorId_fkey" FOREIGN KEY ("jogadorId") REFERENCES "jogadores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_jogoId_fkey" FOREIGN KEY ("jogoId") REFERENCES "Jogo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
