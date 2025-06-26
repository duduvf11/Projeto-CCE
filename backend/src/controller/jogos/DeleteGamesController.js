import { DeleteGamesService } from "../../service/jogos/DeleteGamesService.js"

class DeleteGamesController{
  async handle(req, res){
    try{

      const {campeonatoId} = req.params

      const deleteGamesService = new DeleteGamesService()

      const deletar = await deleteGamesService.execute({campeonatoId})

      res.json(deletar)
    } catch(err){
      console.error("Erro ao deletar jogos:", err.message);
      return res.status(500).json({ error: "Erro interno ao deletar o jogador." });
    }
  }
}

export {DeleteGamesController}