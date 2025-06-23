import prismaClient from "../../prisma/index.js"
import { hash } from "bcryptjs"

class CreateUserService{
  async execute({nome, email, senha, dataNascimento}){
    
    if (!email) return null
    
    const userAlreadyExists = await prismaClient.user.findFirst({
      where: {
        email: email
      }
    })

    if (userAlreadyExists) return null

    const data = new Date(dataNascimento)

    const senhaHash = await hash(senha, 8)

    const user = await prismaClient.user.create({
      data: {
        nome: nome,
        email: email,
        senha: senhaHash,
        dataNascimento: data,
        admin: false
      }, 
      select: {
        id: true,
        email: true
      }
    })

    return user

  }
}

export { CreateUserService}