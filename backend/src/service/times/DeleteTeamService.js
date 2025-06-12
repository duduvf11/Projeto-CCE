import prismaClient from "../../prisma/index.js";

class DeleteTeamService {
  async execute({ id }) {

    if (!id) {
      throw new Error("ID do time é obrigatório para exclusão.");
    }

    try {
      const deletedTeam = await prismaClient.time.delete({
        where: {
          id: parseInt(id),
        },
      });

      return deletedTeam;
    } catch (err) {
      console.error("Erro ao deletar time:", err);
      throw new Error("Não foi possível deletar o time.");
    }
  }
}

export {DeleteTeamService}