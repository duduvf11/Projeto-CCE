import prismaClient from "../../prisma/index.js";

class GetGameService{
  async execute({campeonatoId}){

    const jogos = await prismaClient.jogo.findMany({
      where: {
        campeonatoId: campeonatoId
      }, orderBy: {
        jogo: "asc"
      }
    })

    console.log(jogos)

    return jogos || null

  }
}

export {GetGameService}