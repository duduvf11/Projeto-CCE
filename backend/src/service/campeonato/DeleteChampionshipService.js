import prismaClient from "../../prisma/index.js";

class DeleteChampionshipService {
  async execute({ usuarioId, campeonatoId }) {
    try {
      if (isNaN(usuarioId) || isNaN(campeonatoId)) {
        throw new Error("IDs de usuário ou campeonato inválidos.");
      }

      const campeonato = await prismaClient.campeonato.findUnique({
        where: {
          id: campeonatoId,
        },
      });

      if (!campeonato) {
        throw new Error("Campeonato não encontrado.");
      }

      if (campeonato.usuarioId !== usuarioId) {
        throw new Error("Você não tem permissão para deletar este campeonato.");
      }

      await prismaClient.campeonato.delete({
        where: {
          id: campeonatoId,
        },
      });

    } catch (err) {
      console.error("Erro no serviço ao deletar campeonato:", err.message);
      throw new Error(err.message); // Relança o erro para o controller
    }
  }
}

export { DeleteChampionshipService };