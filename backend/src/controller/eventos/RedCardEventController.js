import { RedCardEventService } from "../../service/eventos/RedCardEventService.js"

class RedCardEventController{

  async handle(req, res){

    try{

      const {jogadorId, jogoId, time} = req.params

      let jogadorIds = parseInt(jogadorId)
      let jogoIds = parseInt(jogoId)

      const redCardController = new RedCardEventService()

      const redCard = await redCardController.execute({jogadorIds, jogoIds, time})

      return res.json(redCard)

    } catch(err){

      console.error("Erro ao adicionar cartão vermelho: " + err)

    }

    

  }
}

export {RedCardEventController}