import { UpdateTeamService } from "../../service/times/UpdateTeamService.js";

class UpdateTeamController{
  async handle(req, res){

    try {

      const { id } = req.params;
      const { nome } = req.body;

      const updateTeamService = new UpdateTeamService();
      const updatedTeam = await updateTeamService.execute({ id, nome });

      return res.json(updatedTeam)

    } catch (err) {

      return res.status(500).json({ error: err.message || "Erro ao atualizar o time" });
      
    }
  }
}

export {UpdateTeamController}