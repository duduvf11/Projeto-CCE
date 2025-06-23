import { CreateTeamService } from "../../service/times/CreateTeamService.js"

class CreateTeam{
  async handle(req, res){

    try {
      const { nome } = req.body
      const usuario = parseInt(req.user_id)

      const createTeamService = new CreateTeamService()

      const createTeam = await createTeamService.execute({ nome, usuario })

      return res.json(createTeam)

    } catch (error) {

      console.error(error)

      return res.status(500).json({ error: "Erro ao criar time." })
    }
  }
}

export {CreateTeam}