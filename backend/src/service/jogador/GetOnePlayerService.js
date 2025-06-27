import prismaClient from "../../prisma/index.js";

class GetOnePlayerService {
  async execute({ id }) {

    const player = await prismaClient.jogador.findFirst({
      where: {
        id: id
      }
    });

    if (!player) {
      throw new Error("Jogador não encontrado.");
    }

    return player;
  }
}

export { GetOnePlayerService };