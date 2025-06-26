import prismaClient from "../../prisma/index.js";

class GetUserChampionshipService {
  async execute({usuarioId}) {
    try {

      const championship = await prismaClient.campeonato.findMany({
        where: {
          usuarioId: usuarioId,
        }
      });

      return championship;
    } catch (err) {
      console.error("Erro no serviço ao buscar campeonato:", err.message);
      throw new Error(err.message);
    }
  }
}

export { GetUserChampionshipService };