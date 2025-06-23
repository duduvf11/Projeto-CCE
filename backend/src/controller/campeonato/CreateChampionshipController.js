import { CreateChampionshipService } from "../../service/campeonato/CreateChampionshipService.js";

class CreateChampionshipController {
  async handle(req, res) {
    try {
      const {
        nome,
        dataInicio,
        dataFim,
        descricao,
        premio,
        formato,
        numeroTimes,
      } = req.body;

      const usuarioId = parseInt(req.user_id)

      if (!usuarioId || !nome || !dataInicio || !dataFim || !formato || !numeroTimes) {
        return res.status(400).json({ error: "Todos os campos obrigatórios devem ser fornecidos." });
      }

      const validFormats = ["MATA_MATA", "GRUPO", "MATA_MATA_CHAVEAMENTO", "SUICO"];
      if (!validFormats.includes(formato)) {
        return res.status(400).json({ error: `Formato inválido. Use um dos seguintes: ${validFormats.join(", ")}` });
      }

      const createChampionshipService = new CreateChampionshipService();

      const createdChampionship = await createChampionshipService.execute({
        usuarioId: parseInt(usuarioId),
        nome,
        dataInicio: new Date(dataInicio),
        dataFim: new Date(dataFim),
        descricao,
        premio: parseFloat(premio),
        formato,
        numeroTimes: parseInt(numeroTimes),
      });

      return res.status(201).json(createdChampionship);
    } catch (err) {
      console.error("Erro ao criar campeonato:", err);
      return res.status(400).json({ error: err.message || "Erro interno do servidor ao criar campeonato." });
    }
  }
}

export { CreateChampionshipController };