import { DeletePlayerService } from "../../service/jogador/DeletePlayerService.js";

class DeletePlayerController {
  async handle(req, res) {
    try {
      const { id } = req.params;

      const playerId = parseInt(id);

      if (isNaN(playerId)) {
        return res.status(400).json({ error: "ID inválido." });
      }

      const deletePlayerService = new DeletePlayerService();
      const deletedPlayer = await deletePlayerService.execute({ id: playerId });

      if (!deletedPlayer) {
        return res.status(404).json({ error: "Jogador não encontrado." });
      }

      return res.json(deletedPlayer);

    } catch (err) {
      console.error("Erro ao deletar jogador:", err.message);
      return res.status(500).json({ error: "Erro interno ao deletar o jogador." });
    }
  }
}

export { DeletePlayerController };