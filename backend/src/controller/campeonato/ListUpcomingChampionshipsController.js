import { ListUpcomingChampionshipsService } from "../../service/campeonato/ListUpcomingChampionshipsService.js";

class ListUpcomingChampionshipsController {
  async handle(req, res) {
    try {
      const listUpcomingChampionshipsService = new ListUpcomingChampionshipsService();

      const upcomingChampionships = await listUpcomingChampionshipsService.execute();

      return res.status(200).json(upcomingChampionships);
    } catch (err) {
      console.error("Erro ao listar campeonatos futuros:", err);
      return res.status(400).json({ error: err.message || "Erro interno do servidor ao listar campeonatos futuros." });
    }
  }
}

export { ListUpcomingChampionshipsController };