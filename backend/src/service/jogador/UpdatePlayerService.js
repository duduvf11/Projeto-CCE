import prismaClient from "../../prisma/index.js";

class UpdatePlayerService {
  async execute({ id, nome, numeroCamisa, genero, altura }) {
    try{ 

      const player = await prismaClient.jogador.findUnique({
        where: {
          id
        }
      })

      if (!player) throw new Error("Jogador não encontrado")

      const numberShort = await prismaClient.jogador.findFirst({
        where: {
          idTime: player.idTime,
          numeroCamisa: numeroCamisa,
          NOT: { id: player.id }
        }
      })

      if (numberShort) throw new Error("Número de camisa já ocupada.")

      const updatePlayer = await prismaClient.jogador.update({
        where: {
          id
        }, 
        data:{
          nome, 
          numeroCamisa, 
          genero, 
          altura
        }
      })

      return updatePlayer

    }catch(err){
      console.error("Erro ao alterar jogador:", err.message);
      throw new Error(err.message);
    }
  }
}

export { UpdatePlayerService };