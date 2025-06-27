import prismaClient from "../../prisma/index.js"

class GetEventsService{
  async execute({jogoIds}){

    try{

      const eventos = await prismaClient.evento.findMany({
        where: {
          jogoId: jogoIds
        }, orderBy: {
          id: 'asc'
        }
      })

      return eventos

  }
       catch(err){
      console.error("Erro ao adicionar cartão vermelho: " + err )
    }
  }
    
}

export {GetEventsService}