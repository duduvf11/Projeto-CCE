import { CreateUserService } from "../service/createUserService.js"

class CreateUserController{
  async handle(req, res) {
    const { nome, email, senha, dataNascimento} = req.body

    const createUserService = new CreateUserService()

    const user = await createUserService.execute()

    return res.json(user)
  }
}

export { CreateUserController }