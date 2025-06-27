import prismaClient from "../../prisma/index.js"

class OffsideEventService{
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

    let impedimento

    switch (time){

      case "a": 

        impedimento = await prismaClient.estatistica.update({
        where: {
          id: match.estatisticaAId
        }, data: {
              impedimentos: {increment: 1}
        }, select: {
          impedimentos: true
        }
      })

      break;

      case "b":

        impedimento = await prismaClient.estatistica.update({
        where: {
          id: match.estatisticaAId
        }, data: {
              impedimentos: {increment: 1}
        }, select: {
          impedimentos: true
        }
      })


      break;

    }

    console.log(impedimento)
    return impedimento

  }
       catch(err){
      console.error("Erro ao adicionar impedimento: " + err )
    }
  }
    
}

export {OffsideEventService}