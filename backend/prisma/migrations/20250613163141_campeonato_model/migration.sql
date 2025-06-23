-- CreateEnum
CREATE TYPE "Formato" AS ENUM ('MATA_MATA', 'GRUPO', 'MATA_MATA_CHAVEAMENTO', 'SUICO');

-- CreateTable
CREATE TABLE "campeonatos" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "descricao" TEXT NOT NULL,
    "premio" DOUBLE PRECISION NOT NULL,
    "formato" "Formato" NOT NULL,
    "numeroTimes" INTEGER NOT NULL,

    CONSTRAINT "campeonatos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campeonato_time" (
    "id" SERIAL NOT NULL,
    "campeonatoId" INTEGER NOT NULL,
    "timeId" INTEGER NOT NULL,

    CONSTRAINT "campeonato_time_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "campeonatos" ADD CONSTRAINT "campeonatos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campeonato_time" ADD CONSTRAINT "campeonato_time_campeonatoId_fkey" FOREIGN KEY ("campeonatoId") REFERENCES "campeonatos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campeonato_time" ADD CONSTRAINT "campeonato_time_timeId_fkey" FOREIGN KEY ("timeId") REFERENCES "times"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
