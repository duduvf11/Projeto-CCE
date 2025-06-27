import { AssistEventService } from "../../service/eventos/AssistEventService.js"

class AssistEventController{
  async handle(req, res){

    const {jogoId, time} = req.params

    let jogoIds = parseInt(jogoId)

    const assistController = new AssistEventService()

    const assist = await assistController.execute({jogoIds, time})

    return res.json(assist)
  }
}

export {AssistEventController}