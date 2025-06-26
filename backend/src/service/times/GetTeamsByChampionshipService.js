import prismaClient from "../../prisma/index.js";

class GetTeamsByChampionshipService{
  async execute({campeonatoId}){
    try{
      const exist = await prismaClient.campeonatoTime.findFirst({
        where: {
          campeonatoId: parseInt(campeonatoId)
        }
      })

      if (!exist) throw new Error("Campeonato não existe")

      const teams = await prismaClient.campeonatoTime.findMany({
        where: {
          campeonatoId: parseInt(campeonatoId)
        }
      })

      return teams

    }catch(err){
      console.error("Erro no serviço ao buscar campeonato:", err.message);
      throw new Error(err.message);
    }
  }
}

export {GetTeamsByChampionshipService}