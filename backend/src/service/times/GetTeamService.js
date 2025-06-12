import prismaClient from "../../prisma/index.js"

class GetTeamService{
  async execute({userId}){
    
    try{

      console.log(userId)

      const getTeam = await prismaClient.time.findMany({
        where: {
          usuario: parseInt(userId)
        }
      })

      if (!getTeam) return 0

      return getTeam

    } catch(err){
      console.error(err)
      return null
    }
  }
}

export {GetTeamService}