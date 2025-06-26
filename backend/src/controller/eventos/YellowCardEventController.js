import { YellowCardEventService } from "../../service/eventos/YellowCardEventService.js"

class YellowCardEventController{

  async handle(req, res){

    try{

      const {jogadorId, jogoId, time} = req.params

      let jogadorIds = parseInt(jogadorId)
      let jogoIds = parseInt(jogoId)

      const yellowCardController = new YellowCardEventService()

      const yellowCard = await yellowCardController.execute({jogadorIds, jogoIds, time})

      return res.json(yellowCard)

    } catch(err){

      console.error("Erro ao adicionar cartão vermelho: " + err)

    }
  }
}

export {YellowCardEventController}