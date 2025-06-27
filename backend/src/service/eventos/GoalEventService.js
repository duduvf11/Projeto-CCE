import prismaClient from "../../prisma/index.js"

class GoalEventService{
  async execute({jogadorIds, jogoIds, time}){

    const golEvent = await prismaClient.evento.create({
      data: {
        tipoEvento: "GOL",
        jogoId: jogoIds,
        jogadorId: jogadorIds
      }
    })

    switch (time){

      case "a": 

        const golA = await prismaClient.jogo.update({
        where: {
          id: jogoIds
        }, data: {
            golsA: {
              increment: 1
            }
        }
      })

      return [golA, golEvent]

      case "b":

        const golB = await prismaClient.jogo.update({
          where: {
            id: jogoIds
          }, data: {
              golsB: {
                increment: 1
              }
          }
        })

        return [golB, golEvent]
    }
  }
}

export {GoalEventService}