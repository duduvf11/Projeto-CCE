import prismaClient from "../../prisma/index.js"

class CreateTeamService{
  async execute({nome, usuario}){

    const countTeams = await prismaClient.time.count({
      where: {
        usuario: usuario,
      },
    });

    if (countTeams >= 5) {
      throw new Error("O usuário já possui o número máximo de 5 times.");
    }

    const createNewTeam = prismaClient.time.create({
      data: {
        nome: nome,
        usuario: usuario
      }
    })  

    return createNewTeam
  }

}

export {CreateTeamService}