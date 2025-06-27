import { GetStatsService } from "../../service/eventos/GetStatsService.js"

class GetStatsController{
  async handle(req, res){

    try{

      const {jogoId} = req.params

      console.log(jogoId)

      let jogoIds = parseInt(jogoId)

      const getStats = new GetStatsService()

      const estatisticas = await getStats.execute({ jogoIds })

      return res.json(estatisticas)

    } catch(err){
        console.err("GetStatsService: ", err)
    }

    
  }
}

export {GetStatsController}