import { StartGameService } from "../../service/jogos/StartGameService.js"

class StartGameController{
  async handle(req, res){

    try{

      const {jogoId} = req.params

      const id = parseInt(jogoId)

      const startService = new StartGameService()

      const start = await startService.execute({id})

      return res.json(start)


    } catch(err){
      console.error("Erro ao iniciar partida: " + err)
    }

  }

}

export {StartGameController}