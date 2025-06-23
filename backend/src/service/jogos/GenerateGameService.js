import prismaClient from "../../prisma/index.js"; // Importa a instância do Prisma Client para interagir com o banco de dados

class GenerateGamesService {
  async execute({ usuarioId, campeonatoId }) {
    try {
      if (isNaN(usuarioId) || isNaN(campeonatoId)) {
        throw new Error("IDs de usuário ou campeonato inválidos.");
      }

      const campeonato = await prismaClient.campeonato.findUnique({
        where: { id: campeonatoId },
        include: {
          times: {
            select: { timeId: true }
          }
        }
      });

      if (!campeonato) {
        throw new Error("Campeonato não encontrado.");
      }

      if (campeonato.usuarioId !== usuarioId) {
        throw new Error("Você não tem permissão para gerar jogos para este campeonato.");
      }

      const timesInscritosIds = campeonato.times.map(t => t.timeId);
      const numeroTimesInscritos = timesInscritosIds.length;

      // prevenção de geração duplicada
      const existingGamesCount = await prismaClient.jogo.count({
        where: { campeonatoId: campeonatoId }
      });

      if (existingGamesCount > 0) {
        throw new Error("Jogos já foram gerados para este campeonato. Exclua os jogos existentes primeiro se deseja regerá-los.");
      }

      let gamesToCreate = [];
      // 'now' é uma data e hora de referência para o agendamento inicial dos jogos.
      // Em um cenário real, você poderia receber datas específicas ou usar uma lógica mais avançada.
      const now = new Date();

      // 5. Lógica de Geração de Jogos por Formato
      // Um 'switch' é usado para aplicar regras de geração específicas para cada formato de campeonato.
      switch (campeonato.formato) {
        // --- Formato MATA_MATA (Eliminação Simples) ---
        // E MATA_MATA_CHAVEAMENTO (Primeira Rodada da Upper Bracket para Dupla Eliminação)
        case "MATA_MATA":
        case "MATA_MATA_CHAVEAMENTO":
          // Validação para formatos de chaveamento:
          // O número de times deve ser maior ou igual a 2 e uma potência de 2 (2, 4, 8, 16, etc.)
          // Isso é fundamental para a criação de chaves balanceadas.
          if (numeroTimesInscritos < 2 || (numeroTimesInscritos & (numeroTimesInscritos - 1)) !== 0) {
             throw new Error("Para formatos MATA_MATA ou MATA_MATA_CHAVEAMENTO, o número de times inscritos deve ser uma potência de 2 (2, 4, 8, 16, etc.) e maior que 1.");
          }

          // Embaralha os IDs dos times inscritos.
          // Isso cria confrontos aleatórios para a primeira rodada da chave.
          // Se o chaveamento fosse rigorosamente pré-definido, esta linha seria ajustada.
          const shuffledTeamsSingleElim = [...timesInscritosIds].sort(() => 0.5 - Math.random());

          // Geração da PRIMEIRA RODADA:
          // Itera sobre os times embaralhados, pegando-os em pares para formar os jogos.
          for (let i = 0; i < shuffledTeamsSingleElim.length; i += 2) {
            gamesToCreate.push({
              campeonatoId: campeonatoId,
              timeCasaId: shuffledTeamsSingleElim[i],      // Primeiro time do par
              timeVisitanteId: shuffledTeamsSingleElim[i + 1], // Segundo time do par
              dataHora: new Date(now.getTime() + (i / 2) * 86400000), // Agendamento simples (ex: a cada 24h)
              local: `Local a definir - Rodada 1`, // Local placeholder
              status: "PENDENTE", // Status inicial
            });
          }

          // Geração das PRÓXIMAS RODADAS com times nulos (placeholders):
          // Esta parte é para o formato MATA_MATA (eliminação simples) que gera a chave completa.
          // Para MATA_MATA_CHAVEAMENTO (dupla eliminação), este bloco NÃO gera a Lower Bracket,
          // apenas a primeira rodada da Upper Bracket foi gerada acima.
          let numGamesInCurrentRoundSingleElim = shuffledTeamsSingleElim.length / 2; // Número de jogos na rodada 1
          let currentRoundSingleElim = 1; // Começa na Rodada 1

          // Continua gerando jogos enquanto houver mais de um jogo na rodada (até a final)
          while (numGamesInCurrentRoundSingleElim > 1) {
              currentRoundSingleElim++; // Avança para a próxima rodada
              numGamesInCurrentRoundSingleElim /= 2; // O número de jogos na próxima rodada é metade da anterior

              // Cria os jogos da rodada atual com times nulos, que serão preenchidos pelos vencedores
              for (let i = 0; i < numGamesInCurrentRoundSingleElim; i++) {
                  gamesToCreate.push({
                      campeonatoId: campeonatoId,
                      timeCasaId: null,      // Placeholder: será preenchido pelo vencedor de jogo anterior
                      timeVisitanteId: null, // Placeholder: será preenchido pelo vencedor de jogo anterior
                      // Lógica de agendamento: tenta espaçar os jogos futuros
                      dataHora: new Date(now.getTime() + (shuffledTeamsSingleElim.length / 2 + i + (currentRoundSingleElim - 2) * (shuffledTeamsSingleElim.length / 4)) * 86400000),
                      local: `Local a definir - Rodada ${currentRoundSingleElim}`,
                      status: "PENDENTE",
                  });
              }
          }
          break; // Fim do caso MATA_MATA e MATA_MATA_CHAVEAMENTO

        // --- Formato GRUPO ---
        case "GRUPO":
          // Validação: Garante que há pelo menos 2 times para formar jogos.
          if (numeroTimesInscritos < 2) {
            throw new Error("Para o formato GRUPO, são necessários pelo menos 2 times inscritos.");
          }
          // Lógica para gerar jogos onde cada time joga contra os outros do grupo uma vez (turno simples).
          for (let i = 0; i < numeroTimesInscritos; i++) {
            for (let j = i + 1; j < numeroTimesInscritos; j++) { // 'j = i + 1' garante que não jogue consigo mesmo e evite jogos duplicados (ida e volta)
              gamesToCreate.push({
                campeonatoId: campeonatoId,
                timeCasaId: timesInscritosIds[i],
                timeVisitanteId: timesInscritosIds[j],
                dataHora: new Date(now.getTime() + gamesToCreate.length * 3 * 24 * 60 * 60 * 1000), // Ex: agendamento a cada 3 dias
                local: "Local a definir - Fase de Grupos",
                status: "PENDENTE",
              });
            }
          }
          break; // Fim do caso GRUPO

        // --- Caso Padrão (Formato Não Suportado) ---
        // Se o formato do campeonato não corresponder a nenhum dos casos acima, lança um erro.
        default:
          throw new Error(`Formato de campeonato '${campeonato.formato}' não suportado para geração automática de jogos.`);
      }

      // 6. Inserção dos Jogos no Banco de Dados (Transação)
      // Usa '$transaction' para garantir que todos os jogos sejam criados com sucesso ou nenhum seja.
      // Isso previne a criação de um "campeonato pela metade" em caso de erro.
      const createdGames = await prismaClient.$transaction(
        gamesToCreate.map(game => prismaClient.jogo.create({ data: game }))
      );

      // 7. Retorno dos Jogos Criados
      // Retorna a lista de jogos que foram criados com sucesso.
      return createdGames;

    } catch (err) {
      // 8. Tratamento de Erros
      // Captura qualquer erro que ocorra durante o processo, loga no console
      // e relança o erro para a camada superior (o Controller) lidar com ele e enviar uma resposta adequada.
      console.error("Erro no serviço de geração de jogos:", err.message);
      throw new Error(err.message);
    }
  }
}

export { GenerateGamesService };