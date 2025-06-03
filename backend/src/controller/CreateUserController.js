import { CreateUserService } from "../service/createUserService.js"

class CreateUserController{
  async handle(req, res) {
    const { nome, email, senha, dataNascimento} = req.body

    const createUserService = new CreateUserService()

    const user = await createUserService.execute({
      nome,
      email,
      senha,
      dataNascimento
    })

    if (user == null){
      return res.status(204).send()
    } else{
      return res.status(200).json(user)
    }
  }
}

export { CreateUserController }