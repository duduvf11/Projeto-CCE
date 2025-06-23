import prismaClient from "../../prisma/index.js";

class GetChampionshipService {
  async execute(campeonatoId) {
    try {
      if (isNaN(campeonatoId)) {
        throw new Error("ID do campeonato inválido.");
      }

      const championship = await prismaClient.campeonato.findUnique({
        where: {
          id: campeonatoId,
        },
        include: {
          times: {
            include: {
              time: true
            },
          },
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
        },
      });

      return championship;
    } catch (err) {
      console.error("Erro no serviço ao buscar campeonato:", err.message);
      throw new Error(err.message);
    }
  }
}

export { GetChampionshipService };