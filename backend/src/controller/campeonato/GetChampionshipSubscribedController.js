import { GetChampionshipSubscribedService } from "../../service/campeonato/GetChampionshipSubscribedService.js";

class GetChampionshipSubscribedController {
  async handle(req, res) {
    try {
      const usuarioId = parseInt(req.user_id);

      if (isNaN(usuarioId)) {
        return res.status(400).json({ error: "IDs de usuário inválido." });
      }

      const getChampionshipSubscribed = new GetChampionshipSubscribedService();

      const times = await getChampionshipSubscribed.execute({ usuarioId });

      return res.status(200).json(times);
    } catch (err) {
      console.error("Erro ao retornar times inscritos em campeonatos", err);
      return res.status(400).json({ error: err.message || "Erro interno do servidor ao fazer o time entrar no campeonato." });
    }
  }
}

export { GetChampionshipSubscribedController }