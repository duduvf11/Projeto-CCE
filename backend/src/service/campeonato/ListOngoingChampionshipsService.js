import prismaClient from "../../prisma/index.js";

class ListOngoingChampionshipsService {
  async execute() {
    try {
      const ongoingChampionships = await prismaClient.campeonato.findMany({
        where: {
          dataInicio: {
            lte: new Date(),
          },
          dataFim: {
            gte: new Date(),
          },
        },
        select: {
          id: true,
          nome: true
        },
        orderBy: {
          dataInicio: 'asc'
        }
      });

      return ongoingChampionships;
    } catch (err) {
      console.error("Erro no serviço ao listar campeonatos em andamento:", err.message);
      throw new Error(err.message);
    }
  }
}

export { ListOngoingChampionshipsService };