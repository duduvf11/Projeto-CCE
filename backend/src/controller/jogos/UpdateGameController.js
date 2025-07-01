import { UpdateGameService } from "../../service/jogos/UpdateGameService.js"

class UpdateGameController{
  async handle(req, res){

    try{

      const {jogoId} = req.params

      //não pode ser vazio


      const id = parseInt(jogoId)

      const updateService = new UpdateGameService()

      const update = await updateService.execute({id})

      return res.json(update)


    } catch(err){
      console.error("Erro ao avançar time: " + err)
    }

  }

}

export {UpdateGameController}