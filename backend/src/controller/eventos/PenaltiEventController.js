import { PenaltiEventService } from "../../service/eventos/PenaltiEventService.js"

class PenaltiEventController{
  async handle(req, res){

    const {jogoId, time} = req.params

    let jogoIds = parseInt(jogoId)

    const penaltiService = new PenaltiEventService()

    const penalti = await penaltiService.execute({jogoIds, time})

    return res.json(penalti)
  }
}

export {PenaltiEventController}