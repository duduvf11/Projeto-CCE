import { ListFinishedChampionshipsService } from "../../service/campeonato/ListFinishedChampionshipsService.js";

class ListFinishedChampionshipsController {
  async handle(req, res) {
    try {
      const listFinishedChampionshipsService = new ListFinishedChampionshipsService();

      const finishedChampionships = await listFinishedChampionshipsService.execute();

      return res.status(200).json(finishedChampionships);
    } catch (err) {
      console.error("Erro ao listar campeonatos finalizados:", err);
      return res.status(400).json({ error: err.message || "Erro interno do servidor ao listar campeonatos finalizados." });
    }
  }
}

export { ListFinishedChampionshipsController };