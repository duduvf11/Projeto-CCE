import { JoinChampionshipService } from "../../service/campeonato/JoinChampionshipService.js";

class JoinChampionshipController {
  async handle(req, res) {
    try {
      const usuarioId = parseInt(req.user_id); 
      const { campeonatoId, timeId } = req.params;

      const parsedCampeonatoId = parseInt(campeonatoId);
      const parsedTimeId = parseInt(timeId);

      if (isNaN(usuarioId) || isNaN(parsedCampeonatoId) || isNaN(parsedTimeId)) {
        return res.status(400).json({ error: "IDs de usuário, campeonato ou time inválidos." });
      }

      const joinChampionshipService = new JoinChampionshipService();

      const joinedChampionship = await joinChampionshipService.execute({
        usuarioId,
        campeonatoId: parsedCampeonatoId,
        timeId: parsedTimeId,
      });

      return res.status(200).json(joinedChampionship);
    } catch (err) {
      console.error("Erro ao fazer o time entrar no campeonato:", err);
      return res.status(400).json({ error: err.message || "Erro interno do servidor ao fazer o time entrar no campeonato." });
    }
  }
}

export { JoinChampionshipController };