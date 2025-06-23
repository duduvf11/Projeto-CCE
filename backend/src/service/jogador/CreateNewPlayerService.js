import prismaClient from "../../prisma/index.js";

class CreateNewPlayerService{
  async execute({timeId, nome, numeroCamisa, genero, altura}){
     try {
      
      console.log(timeId, nome, numeroCamisa, genero, altura)

      if (!nome || !numeroCamisa || !genero || !altura || isNaN(timeId)) {
        throw new Error("Dados incompletos ou inválidos para criar o jogador.");
      }

      const numberShort = await prismaClient.jogador.findFirst({
        where: {
          idTime: timeId,
          numeroCamisa: numeroCamisa
        }
      })

      if (numberShort) throw new Error("Número de camisa já ocupada.")

      const createPlayer = await prismaClient.jogador.create({
        data: {
          nome: nome,
          genero: genero,
          numeroCamisa: numeroCamisa,
          altura: altura,
          idTime: timeId
        }
      })

      return createPlayer;

    } catch (err) {
      console.error("Erro ao criar jogador:", err.message);
      throw new Error(err.message);
    }
  }
}

export {CreateNewPlayerService}