import { GetEventsService } from "../../service/eventos/GetEventsService.js"

class GetEventsController{
  async handle(req, res){

    const {jogoId} = req.params

    let jogoIds = parseInt(jogoId)

    const getEvent = new GetEventsService()

    const eventos = await getEvent.execute({ jogoIds })

    return res.json(eventos)
  }
}

export {GetEventsController}