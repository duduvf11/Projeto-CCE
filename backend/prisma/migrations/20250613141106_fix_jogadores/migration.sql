/*
  Warnings:

  - Changed the type of `genero` on the `jogadores` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('MASCULINO', 'FEMININO');

-- AlterTable
ALTER TABLE "jogadores" DROP COLUMN "genero",
ADD COLUMN     "genero" "Genero" NOT NULL;
