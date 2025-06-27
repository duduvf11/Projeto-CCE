import prismaClient from "../../prisma/index.js"

class GetStatsService{
  async execute({jogoIds}){

    try{

    } catch(err){
      console.error("GetStatsService: ", err)

    }

    console.log(jogoIds)

    const match = await prismaClient.jogo.findFirst({
      where: {
        id: jogoIds
      },
      select: {
        estatisticaAId: true,
        estatisticaBId: true
      }
    })

    let statsA
    let statsB

    if (match.estatisticaAId){
      statsA = await prismaClient.estatistica.findFirst({
        where: {
          id: match.estatisticaAId
        }
      })
    }

    if (match.estatisticaBId){
      statsB = await prismaClient.estatistica.findFirst({
        where: {
          id: match.estatisticaBId
        }
      })
    }

    

    return {a: statsA || null, b: statsB || null}
  }
}

export {GetStatsService}