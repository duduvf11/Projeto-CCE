import { GetUserChampionshipService } from "../../service/campeonato/GetUserChampionshipService.js";

class GetUserChampionshipController{
  async handle(req, res){
    try {
      const usuarioId = parseInt(req.user_id)

      const getUserChampionshipService = new GetUserChampionshipService();

      const championship = await getUserChampionshipService.execute({usuarioId});

      return res.status(200).json(championship);
    } catch (err) {
      console.error("Erro ao buscar campeonato:", err);
      return res.status(400).json({ error: err.message || "Erro interno do servidor ao buscar campeonato." });
    }
  }
}

export { GetUserChampionshipController }