import prismaClient from "../../prisma/index.js";

class JoinChampionshipService {
  async execute({ usuarioId, campeonatoId, timeId }) {
    try {
      if (isNaN(usuarioId) || isNaN(campeonatoId) || isNaN(timeId)) {
        throw new Error("IDs de usuário, campeonato ou time inválidos.");
      }

      // 1
      const time = await prismaClient.time.findUnique({
        where: { id: timeId },
      });

      if (!time) {
        throw new Error("Time não encontrado.");
      }

      if (time.usuarioId !== usuarioId) {
        throw new Error("Você não é o proprietário deste time.");
      }

      // 2
      const campeonato = await prismaClient.campeonato.findUnique({
        where: { id: campeonatoId },
      });

      if (!campeonato) {
        throw new Error("Campeonato não encontrado.");
      }

      if (new Date(campeonato.dataInicio) <= new Date()) {
        throw new Error("As inscrições para este campeonato já foram encerradas ou ele já começou.");
      }

      const timesInscritos = await prismaClient.campeonatoTime.count({
        where: { campeonatoId: campeonatoId },
      });

      if (timesInscritos >= campeonato.numeroTimes) {
        throw new Error("Número máximo de times atingido para este campeonato.");
      }

      const existingEntry = await prismaClient.campeonatoTime.findFirst({
        where: {
          campeonatoId: campeonatoId,
          timeId: timeId,
        },
      });

      if (existingEntry) {
        throw new Error("Este time já está inscrito neste campeonato.");
      }

      const newEntry = await prismaClient.campeonatoTime.create({
        data: {
          campeonatoId: campeonatoId,
          timeId: timeId,
        },
        include: {
          campeonato: {
            select: {
              id: true,
              nome: true
            }
          },
          time: {
            select: {
              id: true,
              nome: true,
            }
          }
        }
      });

      return newEntry;
    } catch (err) {
      console.error("Erro no serviço ao fazer o time entrar no campeonato:", err.message);
      throw new Error(err.message);
    }
  }
}

export { JoinChampionshipService };