import { DeleteChampionshipService } from "../../service/campeonato/DeleteChampionshipService.js";

class DeleteChampionshipController {
  async handle(req, res) {
    try {
      const usuarioId = parseInt(req.user_id); 
      const { id } = req.params; 
      const campeonatoId = parseInt(id);

      if (isNaN(usuarioId) || isNaN(campeonatoId)) {
        return res.status(400).json({ error: "IDs de usuário ou campeonato inválidos." });
      }
      
      const deleteChampionshipService = new DeleteChampionshipService();

      await deleteChampionshipService.execute({
        usuarioId,
        campeonatoId,
      });

      return res.status(204).send();
    } catch (err) {
      console.error("Erro ao deletar campeonato:", err);
      return res.status(400).json({ error: err.message || "Erro interno do servidor ao deletar campeonato." });
    }
  }
}

export { DeleteChampionshipController };