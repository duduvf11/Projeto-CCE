import prismaClient from "../../prisma/index.js";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken"
const {sign} = jwt

class LoginUserService{
  async execute({email, senha}){
    
    const user = await prismaClient.user.findFirst({
      where:{
        email: email
      }
    })

    if (!user) return null
    
    const passwordMatch = await compare(senha, user.senha)

    const userId = user.id

    if (!passwordMatch) return null

    const token = sign({
      nome: user.nome,
      email: user.email,
      admin: user.admin,
      id: user.id
    }, process.env.JWT_SECRET, {
      subject: userId.toString(),
      expiresIn: "30d"
    })

    return {
      token: token
    }
  }
}

export {LoginUserService}