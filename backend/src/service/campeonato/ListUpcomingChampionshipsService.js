import prismaClient from "../../prisma/index.js";

class ListUpcomingChampionshipsService {
  async execute() {
    try {
      const upcomingChampionships = await prismaClient.campeonato.findMany({
        where: {
          dataInicio: {
            gt: new Date()
          },
        },
        select: {
          id: true,
          nome: true,
          dataInicio: true,
          formato: true,
          numeroTimes: true
        },
        orderBy: {
          dataInicio: 'asc'
        }
      });

      return upcomingChampionships;
    } catch (err) {
      console.error("Erro no serviço ao listar campeonatos futuros:", err.message);
      throw new Error(err.message);
    }
  }
}

export { ListUpcomingChampionshipsService };