import { GetTeamsByChampionshipService } from "../../service/times/GetTeamsByChampionshipService.js"


class GetTeamsByChampionshipController{
  async handle(req, res){
    const {campeonatoId} = req.params

    const getTeamsByChampionshipService = new GetTeamsByChampionshipService()

    const getTeams = await getTeamsByChampionshipService.execute({campeonatoId})

    return res.send(getTeams)
  }
}

export {GetTeamsByChampionshipController}