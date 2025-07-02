import prismaClient from "../../prisma/index.js"

class GenerateGroupGameService {
  async execute({ parsedCampeonatoId }) {
    // 1. Obter todos os times que participam do campeonato
    const teams = await prismaClient.campeonatoTime.findMany({
      where: {
        campeonatoId: parsedCampeonatoId
      },
      select: {
        timeId: true
      }
    });

    // Mapear para obter apenas os IDs dos times em um array
    const teamIds = teams.map(team => team.timeId);
    const numTeams = teamIds.length;

    // Verificar se há times suficientes para gerar jogos
    if (numTeams < 2) {
      console.warn(`Não há times suficientes (${numTeams}) para gerar jogos para o campeonatoId: ${parsedCampeonatoId}`);
      return []; // Retorna um array vazio se não houver times suficientes
    }

    const games = [];

    let gameCount = 0;

    for (let i = 0; i < numTeams; i++) {
      for (let j = i + 1; j < numTeams; j++) {
        const teamAId = teamIds[i];
        const teamBId = teamIds[j];
        gameCount++; 

        games.push({
          campeonatoId: parsedCampeonatoId,
          timeA: teamAId,
          timeB: teamBId,
          jogo: gameCount,
          fase: 1,
          status: "PENDENTE",
          estatisticaAId: null,
          estatisticaBId: null,
        });
      }
    }

    // Gerar jogos

    if (games.length > 0) {

      try {
        await prismaClient.jogo.createMany({
          data: games
        });
      } catch (dbError) {
        console.error("Erro ao salvar os jogos no banco de dados:", dbError);
        // Dependendo da sua necessidade, você pode relançar o erro ou lidar com ele de outra forma
        throw new Error("Falha ao persistir os jogos no banco de dados.");
      }
    }

    return games; // Retorna a lista de jogos gerados
  }
}

export { GenerateGroupGameService }