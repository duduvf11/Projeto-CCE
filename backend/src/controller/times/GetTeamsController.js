import { GetTeamService } from "../../service/times/GetTeamService.js";

class GetTeamController{
  async handle(req, res){
    
    try{

      const userId = req.user_id

      const getTeamService = new GetTeamService()

      const getTeams = await getTeamService.execute({userId})

      return res.json(getTeams)

    } catch(err){

      return res.status(500).json(err)
    }
    
  }
}

export {GetTeamController}