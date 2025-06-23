import { GetPlayersByTeamService } from "../../service/jogador/GetPlayersByTeamService.js";

class GetPlayersByTeamController {
  async handle(req, res) {

    try {

      const { timeId } = req.params;

      const getPlayerByTeamService = new GetPlayersByTeamService()

      const getPlayerByTeam = await getPlayerByTeamService.execute({
        timeId: parseInt(timeId)
      });

      return res.status(201).json(getPlayerByTeam);

    } catch (err) {
      console.error("Erro: ", err);
      return res.status(400).json({ error: err.message || "Erro interno do servidor" });
    }
  }
}

export { GetPlayersByTeamController };