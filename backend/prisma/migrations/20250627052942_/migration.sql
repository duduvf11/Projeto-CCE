-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('MASCULINO', 'FEMININO');

-- CreateEnum
CREATE TYPE "Formato" AS ENUM ('MATA_MATA', 'GRUPO', 'MATA_MATA_CHAVEAMENTO');

-- CreateEnum
CREATE TYPE "StatusJogo" AS ENUM ('PENDENTE', 'EM_ANDAMENTO', 'FINALIZADO');

-- CreateEnum
CREATE TYPE "Eventos" AS ENUM ('GOL', 'CARTA_AMARELO', 'CARTAO_VERMELHO');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "times" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "usuario" INTEGER NOT NULL,

    CONSTRAINT "times_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jogadores" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "numeroCamisa" INTEGER NOT NULL,
    "idTime" INTEGER NOT NULL,
    "genero" "Genero" NOT NULL,
    "altura" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "jogadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campeonatos" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "descricao" TEXT,
    "premio" DOUBLE PRECISION,
    "formato" "Formato" NOT NULL,
    "numeroTimes" INTEGER NOT NULL,

    CONSTRAINT "campeonatos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campeonato_time" (
    "id" SERIAL NOT NULL,
    "campeonatoId" INTEGER NOT NULL,
    "nomeCampeonato" TEXT NOT NULL,
    "timeId" INTEGER NOT NULL,
    "nomeTime" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "campeonato_time_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jogo" (
    "id" SERIAL NOT NULL,
    "campeonatoId" INTEGER NOT NULL,
    "nomeA" TEXT,
    "nomeB" TEXT,
    "timeA" INTEGER,
    "timeB" INTEGER,
    "horario" TIMESTAMP(3),
    "status" "StatusJogo" NOT NULL,
    "jogo" INTEGER NOT NULL,
    "fase" INTEGER NOT NULL,
    "golsA" INTEGER NOT NULL DEFAULT 0,
    "golsB" INTEGER NOT NULL DEFAULT 0,
    "vencedor" INTEGER DEFAULT 0,
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
ALTER TABLE "times" ADD CONSTRAINT "times_usuario_fkey" FOREIGN KEY ("usuario") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jogadores" ADD CONSTRAINT "jogadores_idTime_fkey" FOREIGN KEY ("idTime") REFERENCES "times"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campeonatos" ADD CONSTRAINT "campeonatos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campeonato_time" ADD CONSTRAINT "campeonato_time_campeonatoId_fkey" FOREIGN KEY ("campeonatoId") REFERENCES "campeonatos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campeonato_time" ADD CONSTRAINT "campeonato_time_timeId_fkey" FOREIGN KEY ("timeId") REFERENCES "times"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campeonato_time" ADD CONSTRAINT "campeonato_time_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jogo" ADD CONSTRAINT "Jogo_timeA_fkey" FOREIGN KEY ("timeA") REFERENCES "times"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jogo" ADD CONSTRAINT "Jogo_timeB_fkey" FOREIGN KEY ("timeB") REFERENCES "times"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
