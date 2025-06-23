import prismaClient from "../../prisma/index.js";

class DeleteTeamChampionshipService {
  async execute({ usuarioId, campeonatoId, timeId }) {
    try {
      if (isNaN(usuarioId) || isNaN(campeonatoId) || isNaN(timeId)) {
        throw new Error("IDs de usuário, campeonato ou time inválidos.");
      }

      const existingAssociation = await prismaClient.campeonatoTime.findFirst({
        where: {
          campeonatoId: campeonatoId,
          timeId: timeId,
        },
        include: {
          time: true
        },
      });

      if (!existingAssociation) {
        throw new Error("Associação entre time e campeonato não encontrada.");
      }

      if (existingAssociation.time.usuarioId !== usuarioId) {
        throw new Error("Você não tem permissão para remover este time do campeonato, pois não é o proprietário.");
      }

      await prismaClient.campeonatoTime.delete({
        where: {
          id: existingAssociation.id
        },
      });

    } catch (err) {
      console.error("Erro no serviço ao remover time do campeonato:", err.message);
      throw new Error(err.message);
    }
  }
}

export { DeleteTeamChampionshipService };