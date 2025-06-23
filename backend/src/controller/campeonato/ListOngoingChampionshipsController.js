import { ListOngoingChampionshipsService } from "../../service/campeonato/ListOngoingChampionshipsService.js";

class ListOngoingChampionshipsController {
  async handle(req, res) {
    try {
      const listOngoingChampionshipsService = new ListOngoingChampionshipsService();

      const ongoingChampionships = await listOngoingChampionshipsService.execute();

      return res.status(200).json(ongoingChampionships);
    } catch (err) {
      console.error("Erro ao listar campeonatos em andamento:", err);
      return res.status(400).json({ error: err.message || "Erro interno do servidor ao listar campeonatos em andamento." });
    }
  }
}

export { ListOngoingChampionshipsController };