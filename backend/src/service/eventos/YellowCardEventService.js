import prismaClient from "../../prisma/index.js"

class YellowCardEventService{
  async execute({jogadorIds, jogoIds, time}){

    try{

      const yellowCardEvent = await prismaClient.evento.create({
      data: {
        tipoEvento: "CARTA_AMARELO",
        jogoId: jogoIds,
        jogadorId: jogadorIds
      }
    })

    console.log(yellowCardEvent)

    const match = await prismaClient.jogo.findFirst({
      where: {
        id: jogoIds
      }, select: {
        estatisticaAId: true,
        estatisticaBId: true
      }
    })

    console.log(match)

    let cartaoAmarelo

    switch (time){

      case "a": 

        cartaoAmarelo = await prismaClient.estatistica.update({
        where: {
          id: match.estatisticaAId
        }, data: {
              cartaoAmarelo: {increment: 1}
        }, select: {
          cartaoVermelho: true
        }
      })

      break;

      case "b":

        cartaoAmarelo = await prismaClient.estatistica.update({
        where: {
          id: match.estatisticaAId
        }, data: {
              cartaoAmarelo: {increment: 1}
        }, select: {
          cartaoVermelho: true
        }
      })

      break;

    
    }

    console.log(cartaoAmarelo)
    return [yellowCardEvent, cartaoAmarelo]

  }
       catch(err){
      console.error("Erro ao adicionar cartão amarelo: " + err )
    }
  }
    
}

export {YellowCardEventService}