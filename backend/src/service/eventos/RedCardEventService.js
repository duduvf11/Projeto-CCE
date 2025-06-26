import prismaClient from "../../prisma/index.js"

class RedCardEventService{
  async execute({jogadorIds, jogoIds, time}){

    try{

      const redCardEvent = await prismaClient.evento.create({
      data: {
        tipoEvento: "CARTAO_VERMELHO",
        jogoId: jogoIds,
        jogadorId: jogadorIds
      }
    })

    console.log(redCardEvent)

    const match = await prismaClient.jogo.findFirst({
      where: {
        id: jogoIds
      }, select: {
        estatisticaAId: true,
        estatisticaBId: true
      }
    })

    console.log(match)

    let cartaoVermelho

    switch (time){

      case "a": 

        cartaoVermelho = await prismaClient.estatistica.update({
        where: {
          id: match.estatisticaAId
        }, data: {
              cartaoVermelho: {increment: 1}
        }, select: {
          cartaoVermelho: true
        }
      })

      break;

      case "b":

        cartaoVermelho = await prismaClient.estatistica.update({
        where: {
          id: match.estatisticaAId
        }, data: {
              cartaoVermelho: {increment: 1}
        }, select: {
          cartaoVermelho: true
        }
      })


      break;

      

    }

    console.log(cartaoVermelho)
    return [redCardEvent, cartaoVermelho]

  }
       catch(err){
      console.error("Erro ao adicionar cartão vermelho: " + err )
    }
  }
    
}

export {RedCardEventService}