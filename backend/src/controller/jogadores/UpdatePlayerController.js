import { UpdatePlayerService } from "../../service/jogador/UpdatePlayerService.js";

class UpdatePlayerController {
  async handle(req, res) {

    try {

      const { id } = req.params;
      const { nome, numeroCamisa, genero, altura } = req.body;

      if (!["MASCULINO", "FEMININO", "OUTRO"].includes(genero)) {
        return res.status(400).json({ error: "Gênero inválido. Use 'MASCULINO', 'FEMININO' ou 'OUTRO'." });
      }

      const updatePlayerService = new UpdatePlayerService();

      const updatedPlayer = await updatePlayerService.execute({
        id: parseInt(id),
        nome,
        numeroCamisa: parseInt(numeroCamisa),
        genero,
        altura: parseFloat(altura)
      });

      return res.status(200).json(updatedPlayer)

    } catch(err){
      console.error("Erro ao criar jogador:", err);
      return res.status(400).json({ error: err.message || "Erro interno do servidor" });
    }
  }
}

export { UpdatePlayerController };