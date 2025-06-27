import { GetGameService } from "../../service/jogos/GetGameService.js"

class GetGameController{
  async handle(req, res){
    const {campeonatoIds} = req.params

    const campeonatoId = parseInt(campeonatoIds)

    const getGameService = new GetGameService()

    const games = await getGameService.execute({campeonatoId})

    return res.json(games)
  }
}

export {GetGameController}