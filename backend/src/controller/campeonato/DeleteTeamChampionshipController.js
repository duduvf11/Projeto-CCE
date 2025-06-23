import { DeleteTeamChampionshipService } from "../../service/campeonato/DeleteTeamChampionshipService.js";

class DeleteTeamChampionshipController {
  async handle(req, res) {
    try {
      const usuarioId = parseInt(req.user_id);
      const { campeonatoId, timeId } = req.params;

      const parsedCampeonatoId = parseInt(campeonatoId);
      const parsedTimeId = parseInt(timeId);

      if (isNaN(usuarioId) || isNaN(parsedCampeonatoId) || isNaN(parsedTimeId)) {
        return res.status(400).json({ error: "IDs de usuário, campeonato ou time inválidos." });
      }

      const deleteTeamChampionshipService = new DeleteTeamChampionshipService();

      await deleteTeamChampionshipService.execute({
        usuarioId,
        campeonatoId: parsedCampeonatoId,
        timeId: parsedTimeId,
      });

      return res.status(204).send();
    } catch (err) {
      console.error("Erro ao remover time do campeonato:", err);
      return res.status(400).json({ error: err.message || "Erro interno do servidor ao remover time do campeonato." });
    }
  }
}

export { DeleteTeamChampionshipController };