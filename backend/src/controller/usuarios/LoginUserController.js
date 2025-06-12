import { LoginUserService } from "../../service/usuarios/LoginUserService.js";

class LoginUserController{
  async handle(req, res){

  const {email, senha} = req.body

  const loginUserService = new LoginUserService()

  const login = await loginUserService.execute({email, senha})

  const token = login.token;

  res.cookie('token', token, {
      httpOnly: false,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000 * 7
    });

  return res.json(login)

  }
}

export {LoginUserController}