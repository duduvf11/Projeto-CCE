import prismaClient from "../prisma/index.js";
import { compare } from "bcryptjs";

class LoginUserService{
  async execute({email, senha}){
    
    const user = await prismaClient.user.findFirst({
      where:{
        email: email
      }
    })
    console.log(user)

    if (!user) return null
    
    const passwordMatch = await compare(senha, user.senha)
    console.log(passwordMatch)

    if (!passwordMatch) return null

    return {ok: "true"}
  }
}

export {LoginUserService}