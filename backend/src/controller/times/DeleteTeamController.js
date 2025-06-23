import { DeleteTeamService } from "../../service/times/DeleteTeamService.js";

class DeleteTeamController {
  async handle(req, res) {

    try {

      const { id } = req.params;

      const deleteTeamService = new DeleteTeamService();
      const deletedTeam = await deleteTeamService.execute({ id });

      return res.json(deletedTeam);
      
    } catch (err) {
      return res.status(500).json({ error: err.message || "Erro ao deletar o time" });
    }
  }
}

export { DeleteTeamController };