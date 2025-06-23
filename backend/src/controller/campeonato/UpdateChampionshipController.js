import { UpdateChampionshipService } from "../../service/campeonato/UpdateChampionshipService.js";

class UpdateChampionshipController {
  async handle(req, res) {
    try {
      const usuarioId = parseInt(req.user_id);
      const { id } = req.params;
      const campeonatoId = parseInt(id);

      const {
        nome,
        dataInicio,
        dataFim,
        descricao,
        premio,
        formato,
        numeroTimes,
      } = req.body;

      if (isNaN(usuarioId) || isNaN(campeonatoId)) {
        return res.status(400).json({ error: "IDs de usuário ou campeonato inválidos." });
      }

      const updateChampionshipService = new UpdateChampionshipService();

      const updatedChampionship = await updateChampionshipService.execute({
        usuarioId,
        campeonatoId,
        nome,
        dataInicio,
        dataFim,
        descricao,
        premio,
        formato,
        numeroTimes,
      });

      return res.status(200).json(updatedChampionship);
    } catch (err) {
      console.error("Erro ao atualizar campeonato:", err);
      return res.status(400).json({ error: err.message || "Erro interno do servidor ao atualizar campeonato." });
    }
  }
}

export { UpdateChampionshipController };