import prismaClient from "../../prisma/index.js";

class GetPlayersByTeamService {
  async execute({timeId}) {
    
    try {
      const idTime = parseInt(timeId);

      if (isNaN(idTime)) {
        throw new Error("ID do time inválido.");
      }

      const teamExists = await prismaClient.time.findUnique({
        where: {
          id: idTime
        }
      });

      if (!teamExists) {
        throw new Error("Time não encontrado.");
      }

      const players = await prismaClient.jogador.findMany({
        where: {
          idTime: idTime
        },
        orderBy: {
          numeroCamisa: 'asc'
        }, select: {
          id: true,
          numeroCamisa: true,
          nome: true,
          genero: true,
          altura: true,
        }
      });

      return players;

    } catch (err) {
      console.error("Erro ao buscar jogadores do time:", err.message);
      throw new Error(err.message);
    }
  }
}

export { GetPlayersByTeamService };