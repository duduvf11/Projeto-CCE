import prismaClient from "../../prisma/index.js"

class ShotEventService{
  async execute({jogoIds, time}){

    try{

    const match = await prismaClient.jogo.findFirst({
      where: {
        id: jogoIds
      }, select: {
        estatisticaAId: true,
        estatisticaBId: true
      }
    })

    console.log(match)

    let finalizacao

    switch (time){

      case "a": 

        finalizacao = await prismaClient.estatistica.update({
        where: {
          id: match.estatisticaAId
        }, data: {
              finalizacoes: {increment: 1}
        }, select: {
          finalizacoes: true
        }
      })

      break;

      case "b":

        finalizacao = await prismaClient.estatistica.update({
        where: {
          id: match.estatisticaAId
        }, data: {
              finalizacoes: {increment: 1}
        }, select: {
          finalizacoes: true
        }
      })


      break;

    }

    console.log(assistencia)
    return assistencia

  }
       catch(err){
      console.error("Erro ao adicionar penalti: " + err )
    }
  }
    
}

export {ShotEventService}