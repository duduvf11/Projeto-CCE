import { LoginUserService } from "../service/LoginUserService.js";

class LoginUserController{
  async handle(req, res){

  const {email, senha} = req.body

  const loginUserService = new LoginUserService()

  const login = await loginUserService.execute({email, senha})

  return res.json(login)

  }
}

export {LoginUserController}