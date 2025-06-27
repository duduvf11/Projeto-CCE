import prismaClient from "../../prisma/index.js"

class StartGameService{
  async execute({jogoId}){
    try{

      const exist = await prismaClient.jogo.findFirst({
        where: {
          id: jogoId
        },
        select: {
          id: true,
          status: true,
          estatisticaAId: true,
          estatisticaBId: true
        }
      })

      console.log(exist)

      if (!exist){
        throw new Error("Jogo não existe")
      }

      if (exist.status !== "PENDENTE") {
          throw new Error(`Jogo já está ${exist.status.toLowerCase()}. Não pode ser iniciado.`);
      }

      let estatisticaA_id = exist.estatisticaAId;
      let estatisticaB_id = exist.estatisticaBId

      if (!estatisticaA_id) {
          const statsA = await prismaClient.estatistica.create({ data: {}, select: {id: true} });
          estatisticaA_id = statsA.id;
      }

      console.log(estatisticaA_id)

      if (!estatisticaB_id) {
          const statsB = await prismaClient.estatistica.create({ data: {} });
          estatisticaB_id = statsB.id;
      }

      console.log(estatisticaB_id)

      const start = await prismaClient.jogo.update({
        where: {
          id: exist.id
        }, data: {
          status: "EM_ANDAMENTO",
          estatisticaAId: estatisticaA_id,
          estatisticaBId: estatisticaB_id
        }
      })

      return start


    } catch(err){
      console.error("Erro ao iniciar partida: " + err)
      throw new Error(err.message)
    }

  }
}

export {StartGameService}