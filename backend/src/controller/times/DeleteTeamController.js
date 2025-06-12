import { DeleteTeamService } from "../../service/times/DeleteTeamService.js";

class DeleteTeamController{
  async handle(req, res){
    const {id} = req.params
    console.log(id)
    return res.json(id)
  }
}

export {DeleteTeamController}