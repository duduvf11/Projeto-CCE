import prismaClient from "../../prisma/index.js";

class UpdateChampionshipService {
  async execute({
    usuarioId,
    campeonatoId,
    nome,
    dataInicio,
    dataFim,
    descricao,
    premio,
    formato,
    numeroTimes,
  }) {
    try {
      if (isNaN(usuarioId) || isNaN(campeonatoId)) {
        throw new Error("IDs de usuário ou campeonato inválidos.");
      }

      const existingChampionship = await prismaClient.campeonato.findUnique({
        where: {
          id: campeonatoId,
        },
      });

      if (!existingChampionship) {
        throw new Error("Campeonato não encontrado.");
      }

      if (existingChampionship.usuarioId !== usuarioId) {
        throw new Error("Você não tem permissão para atualizar este campeonato.");
      }

      const updateData = {};
      if (nome !== undefined) updateData.nome = nome;
      if (dataInicio !== undefined) updateData.dataInicio = new Date(dataInicio);
      if (dataFim !== undefined) updateData.dataFim = new Date(dataFim);
      if (descricao !== undefined) updateData.descricao = descricao;
      if (premio !== undefined) updateData.premio = parseFloat(premio);
      if (formato !== undefined) updateData.formato = formato;
      if (numeroTimes !== undefined) updateData.numeroTimes = parseInt(numeroTimes);

      if (updateData.dataInicio && updateData.dataFim) {
        if (updateData.dataFim < updateData.dataInicio) {
          throw new Error("A data de término não pode ser anterior à data de início do campeonato.");
        }
      } else if (updateData.dataInicio && existingChampionship.dataFim < updateData.dataInicio) {
          throw new Error("A nova data de início não pode ser posterior à data de término atual.");
      } else if (updateData.dataFim && existingChampionship.dataInicio > updateData.dataFim) {
          throw new Error("A nova data de término não pode ser anterior à data de início atual.");
      }

      const updatedChampionship = await prismaClient.campeonato.update({
        where: {
          id: campeonatoId,
        },
        data: updateData,
      });

      return updatedChampionship;
    } catch (err) {
      console.error("Erro no serviço ao atualizar campeonato:", err.message);
      throw new Error(err.message);
    }
  }
}

export { UpdateChampionshipService };