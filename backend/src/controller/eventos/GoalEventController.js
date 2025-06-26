import { GoalEventService } from "../../service/eventos/GoalEventService.js"

class GoalEventController{
  async handle(req, res){

    const {jogadorId, jogoId, time} = req.params

    let jogadorIds = parseInt(jogadorId)
    let jogoIds = parseInt(jogoId)

    const goalController = new GoalEventService()

    const gol = await goalController.execute({jogadorIds, jogoIds, time})

    return res.json(gol)
  }
}

export {GoalEventController}