import { OffsideEventService } from "../../service/eventos/OffsideEventService.js"

class OffsideEventController{
  async handle(req, res){

    const {jogoId, time} = req.params

    let jogoIds = parseInt(jogoId)

    const offsideService = new OffsideEventService()

    const impedimento = await offsideService.execute({jogoIds, time})

    return res.json(impedimento)
  }
}

export {OffsideEventController}