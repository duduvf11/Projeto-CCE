import prismaClient from "../../prisma/index.js";

class GetChampionshipSubscribedService {
  async execute({ usuarioId}) {
    try {
      if (isNaN(usuarioId)) {
        throw new Error("IDs de usuário inválido.");
      }

      const user = await prismaClient.user.findFirst({
        where: {
          id: usuarioId
        }
      })

      if (!user) throw new Error("Usuário não existe")

      const times = await prismaClient.campeonatoTime.findMany({
        where: {
          usuarioId: usuarioId
        }
      })

      return times

    } catch (err) {
      console.error("Erro ao encantrar os times do usuario: ", err.message);
      throw new Error(err.message);
    }
  }
}

export { GetChampionshipSubscribedService };