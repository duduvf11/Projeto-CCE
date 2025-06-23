import prismaClient from "../../prisma/index.js";

class ListFinishedChampionshipsService {
  async execute() {
    try {
      const finishedChampionships = await prismaClient.campeonato.findMany({
        where: {
          dataFim: {
            lt: new Date(),
          },
        },
        select: {
          id: true,
          nome: true,
        },
        orderBy: {
          dataFim: 'desc',
        }
      });

      return finishedChampionships;
    } catch (err) {
      console.error("Erro no serviço ao listar campeonatos finalizados:", err.message);
      throw new Error(err.message);
    }
  }
}

export { ListFinishedChampionshipsService };