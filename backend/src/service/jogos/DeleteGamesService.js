import prismaClient from "../../prisma/index.js";

class DeleteGamesService{
  async execute({campeonatoId}){
    try{

      const deletar = await prismaClient.jogo.deleteMany({
        where: {
          campeonatoId: parseInt(campeonatoId)
        }
      })

      return deletar

    } catch(err){
      console.error(err)
    }
  }
}

export {DeleteGamesService}