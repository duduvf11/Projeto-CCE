import prismaClient from "../../prisma/index.js"

class AssistEventService{
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

    let assistencia

    switch (time){

      case "a": 

        assistencia = await prismaClient.estatistica.update({
        where: {
          id: match.estatisticaAId
        }, data: {
              assistencias: {increment: 1}
        }, select: {
          assistencias: true
        }
      })

      break;

      case "b":

        assistencia = await prismaClient.estatistica.update({
        where: {
          id: match.estatisticaAId
        }, data: {
              assistencias: {increment: 1}
        }, select: {
          assistencias: true
        }
      })


      break;

    }

    console.log(assistencia)
    return assistencia

  }
       catch(err){
      console.error("Erro ao adicionar cartão vermelho: " + err )
    }
  }
    
}

export {AssistEventService}