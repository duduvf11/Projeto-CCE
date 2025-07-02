import prismaClient from "../../prisma/index.js"; // Importa a instância do Prisma Client para interagir com o banco de dados

class GenerateGameService {
  async execute({ usuarioId, campeonatoId }) {
    try {
      if (isNaN(usuarioId) || isNaN(campeonatoId)) {
        throw new Error("IDs de usuário ou campeonato inválidos.");
      }

      const campeonato = await prismaClient.campeonato.findUnique({
        where: { id: campeonatoId },
        include: {
          times: {select: {time: true, timeId: true}}
        }
      });

      const timesInscritosIds = campeonato.times.map(t => t.timeId);
      const numeroTimesInscritos = timesInscritosIds.length;

      if (!campeonato) {
        throw new Error("Campeonato não encontrado.");
      }
      
      /*
      if (campeonato.usuarioId !== usuarioId) {
        throw new Error("Você não tem permissão para gerar jogos para este campeonato.");
      }
      */
      
      // prevenção de geração duplicada
      const existingGamesCount = await prismaClient.jogo.count({
        where: { campeonatoId: campeonatoId }
      });

      if (existingGamesCount > 0) {
        throw new Error("Jogos já foram gerados para este campeonato. Exclua os jogos existentes primeiro se deseja regerá-los.");
      }

    

      function mataMata(numeroTimesInscritos){

        let numTimes = numeroTimesInscritos / 2

        for (let i = 0; i < numTimes; i++){
          gamesToCreate.push({
            campeonatoId: campeonatoId,
            nomeA: campeonato.times[i].time.nome || null,
            nomeB: campeonato.times[(numeroTimesInscritos -1 ) - i].time.nome || null,
            timeA: timesInscritosIds[i] || null,
            timeB: timesInscritosIds[(numeroTimesInscritos -1 ) - i] || null,
            jogo: i + 1,
            fase: 1,
            status: "PENDENTE"
          })
        }

        let faseAtual = 1;
    let jogosNaFaseAtual = numeroTimesInscritos / 2;

    while (jogosNaFaseAtual > 1) {
        faseAtual++;
        let jogo = 1;
        let jogosProximaFase = Math.ceil(jogosNaFaseAtual / 2);

        for (let j = 0; j < jogosProximaFase; j++) {
            gamesToCreate.push({
                campeonatoId: campeonatoId,
                timeA: null,
                timeB: null,
                jogo: j + 1,
                fase: faseAtual,
                status: "PENDENTE",
                estatisticaAId: null,
                estatisticaBId: null,
            });
        }
        jogosNaFaseAtual = jogosProximaFase;
    }
      }

      let gamesToCreate = [];

      switch ("MATA_MATA") {

        case "MATA_MATA":

          switch (numeroTimesInscritos){
            case 2: 

            case 4:
            
            case 8:

            const a = mataMata(numeroTimesInscritos)
            console.log(gamesToCreate)

            case 16:
          }

      }

      
      const createdGamesResult = await prismaClient.jogo.createMany({
        data: gamesToCreate
      });      

      
      
      return createdGamesResult;

    } catch (err) {
      console.error("Erro no serviço de geração de jogos:", err.message);
      throw new Error(err.message);
    }
  }
}

export { GenerateGameService };