import { CreateNewPlayerService } from "../../service/jogador/CreateNewPlayerService.js";

class CreateNewPlayerController {
  async handle(req, res) {

    try {

      const { timeId } = req.params;
      const { nome, numeroCamisa, genero, altura } = req.body;

      if (!["MASCULINO", "FEMININO"].includes(genero)) {
        return res.status(400).json({ error: "Gênero inválido. Use 'MASCULINO' ou 'FEMININO'." });
      }

      const createNewPlayerService = new CreateNewPlayerService();

      const createdPlayer = await createNewPlayerService.execute({
        timeId: parseInt(timeId),
        nome,
        numeroCamisa: parseInt(numeroCamisa),
        genero,
        altura: parseFloat(altura)
      });

      return res.status(201).json(createdPlayer);

    } catch (err) {
      console.error("Erro ao criar jogador:", err);
      return res.status(400).json({ error: err.message || "Erro interno do servidor" });
    }
  }
}

export { CreateNewPlayerController };