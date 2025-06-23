import prismaClient from "../../prisma/index.js";

class CreateChampionshipService {
  async execute({
    usuarioId,
    nome,
    dataInicio,
    dataFim,
    descricao,
    premio,
    formato,
    numeroTimes,
  }) {
    try {
      if (!usuarioId || !nome || !dataInicio || !dataFim || !formato || !numeroTimes || isNaN(usuarioId) || isNaN(numeroTimes) || isNaN(premio)) {
        throw new Error("Dados incompletos ou inválidos para criar o campeonato.");
      }

      if (new Date(dataFim) < new Date(dataInicio)) {
        throw new Error("A data de término não pode ser anterior à data de início do campeonato.");
      }

      const createdChampionship = await prismaClient.campeonato.create({
        data: {
          usuarioId: usuarioId,
          nome: nome,
          dataInicio: dataInicio,
          dataFim: dataFim,
          descricao: descricao,
          premio: premio,
          formato: formato,
          numeroTimes: numeroTimes,
        },
      });

      return createdChampionship;
    } catch (err) {
      console.error("Erro ao criar campeonato:", err.message);
      throw new Error(err.message);
    }
  }
}

export { CreateChampionshipService };