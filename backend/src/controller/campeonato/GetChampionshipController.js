import { GetChampionshipService } from "../../service/campeonato/GetChampionshipService.js";

class GetChampionshipController {
  async handle(req, res) {
    try {
      const { id } = req.params;
      const campeonatoId = parseInt(id);

      if (isNaN(campeonatoId)) {
        return res.status(400).json({ error: "ID do campeonato inválido." });
      }

      const getChampionshipService = new GetChampionshipService();

      const championship = await getChampionshipService.execute(campeonatoId);

      if (!championship) {
        return res.status(404).json({ error: "Campeonato não encontrado." });
      }

      return res.status(200).json(championship);
    } catch (err) {
      console.error("Erro ao buscar campeonato:", err);
      return res.status(400).json({ error: err.message || "Erro interno do servidor ao buscar campeonato." });
    }
  }
}

export { GetChampionshipController };