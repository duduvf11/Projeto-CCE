import { UpdateGameService } from "../../service/jogos/UpdateGameService.js";

class UpdateGameController {
  async handle(req, res) {
    try {
      const { jogoId } = req.params;

      if (!jogoId || isNaN(Number(jogoId))) {
        return res.status(400).json({ message: "ID do jogo inválido. Forneça um número válido." });
      }

      const parsedJogoId = parseInt(jogoId, 10);

      const updateService = new UpdateGameService();

      const updatedGame = await updateService.execute({ id: parsedJogoId });

      if (!updatedGame) {
        return res.status(404).json({ message: "Jogo não encontrado ou não pôde ser atualizado." });
      }

      return res.status(200).json(updatedGame);

    } catch (err) {
      
      console.error("Erro ao atualizar jogo: ", err);

      return res.status(500).json({ message: "Ocorreu um erro interno no servidor ao tentar atualizar o jogo." });
    }
  }
}

export { UpdateGameController };