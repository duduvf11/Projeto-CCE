import { CreateNewPlayerService } from "../../service/jogador/CreateNewPlayerService"

class CreateNewPlayerController{
  async handle(req, res){

    const createNewPlayerService = new CreateNewPlayerService()
    const createPlayer = await createNewPlayerService.execute({})

    return createPlayer
  }
}

export {CreateNewPlayerController}