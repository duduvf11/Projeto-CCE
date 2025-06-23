import prismaClient from "../../prisma/index.js";

class UpdateTeamService {

  async execute({ id, nome }) {

    if (!id || !nome) {
      throw new Error("ID e nome são obrigatórios para atualizar o time.");
    }

    try {
      const updatedTeam = await prismaClient.time.update({
        where: {
          id: parseInt(id),
        },
          data: {
          nome: nome,
        },
      });

      return updatedTeam;

    } catch (err) {
      console.error("Erro ao atualizar o time:", err);
      throw new Error("Não foi possível atualizar o time.");
    }

  }

}

export { UpdateTeamService };