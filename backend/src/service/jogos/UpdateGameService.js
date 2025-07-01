import prismaClient from "../../prisma/index.js"

class UpdateGameService{
  async execute({id}){
    try{

      const jogo = await prismaClient.jogo.findUnique({
        where: {
          id: id
        },
        select: {
          campeonatoId: true,
          timeA: true,
          timeB: true,
          fase: true,
          jogo: true
        }
      })

      console.log(jogo)

      const campeonato = await prismaClient.campeonato.findUnique({
        where: {
          id: jogo.campeonatoId
        },
        select: {
          formato: true,
          id: true
        }
      })

      console.log(campeonato)

      const jogosPorFase = await prismaClient.jogo.count({
        where: {
          campeonatoId: campeonato.id,
          fase: jogo.fase
        }
      })

      console.log(jogosPorFase)

      switch (campeonato.formato){
        case "MATA_MATA":



        case "GRUPO":
      }

      //pesquiso campeonato

      //update jogo

    } catch(err){
      console.error("Erro ao iniciar partida: " + err)
      throw new Error(err.message)
    }

  }
}

export {UpdateGameService}