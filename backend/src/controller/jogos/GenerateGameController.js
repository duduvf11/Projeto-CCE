import { GenerateGameService } from "../../service/jogos/GenerateGameService.js";

//numero de times, formato, 

class GenerateGameController {
  async handle(req, res) {
    try {
      const usuarioId = req.user_id;
      const { campeonatoId } = req.params;
      const parsedCampeonatoId = parseInt(campeonatoId);
      
      console.log("IDs recebidos:", { usuarioId, campeonatoId });
      
      if (isNaN(usuarioId) || isNaN(parsedCampeonatoId)) {
        console.log("IDs inválidos:", { usuarioId, campeonatoId });
        return res.status(400).json({ error: "IDs de usuário ou campeonato inválidos." });
      }

      const generateGamesService = new GenerateGameService();

      const generatedGames = await generateGamesService.execute({
        usuarioId,
        campeonatoId: parsedCampeonatoId
      });

      return res.status(201).json({
        message: "Jogos do campeonato gerados com sucesso!",
        games: generatedGames
      });
    } catch (err) {
      console.error("Erro ao gerar jogos do campeonato:", err);
      return res.status(400).json({ error: err.message || "Erro interno do servidor ao gerar jogos." });
    }
  }
}

export { GenerateGameController };