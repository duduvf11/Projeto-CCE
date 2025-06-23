import { GetOnePlayerService } from "../../service/jogador/GetOnePlayerService.js";

class GetOnePlayerController {
  async handle(req, res) {

    try {

      const { id } = req.params;

      const playerId = parseInt(id);

      if (isNaN(playerId)) {
        return res.status(400).json({ error: "ID inválido." });
      }

      const getOnePlayerService = new GetOnePlayerService();
      const player = await getOnePlayerService.execute({ id: playerId });

      if (!player) {
        return res.status(404).json({ error: "Jogador não encontrado." });
      }

      return res.json(player);

    } catch (err) {
    
      console.error("Erro ao buscar jogador:", err.message);
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  }
}

export { GetOnePlayerController };