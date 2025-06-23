import prismaClient from "../../prisma/index.js"

class GetTeamService {
  async execute({ userId }) {

    try {

      const teams = await prismaClient.time.findMany({
        where: {
          usuario: parseInt(userId),
        }
      });

      return teams;

    } catch (err) {
      
      console.error("Erro ao buscar times do usuário:", err);
      throw new Error("Erro ao buscar times.");
    }
  }
}

export { GetTeamService };