import prismaClient from "../../prisma/index.js"

class PenaltiEventService{
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

    let penalti

    switch (time){

      case "a": 

        penalti = await prismaClient.estatistica.update({
        where: {
          id: match.estatisticaAId
        }, data: {
              penaltis: {increment: 1}
        }, select: {
          penaltis: true
        }
      })

      break;

      case "b":

        penalti = await prismaClient.estatistica.update({
        where: {
          id: match.estatisticaAId
        }, data: {
              penaltis: {increment: 1}
        }, select: {
          penaltis: true
        }
      })


      break;

    }

    console.log(penalti)
    return penalti

  }
       catch(err){
      console.error("Erro ao adicionar penalti: " + err )
    }
  }
    
}

export {PenaltiEventService}