import prismaClient from "../../prisma/index.js";

class DeletePlayerService {
  async execute({ id }) {
    
    const player = await prismaClient.jogador.findUnique({
      where: { id }
    });

    if (!player) {
      throw new Error("Jogador não encontrado.");
    }

    const deletedPlayer = await prismaClient.jogador.delete({
      where: { id },
      select: {
        nome: true,
        numeroCamisa: true
      }
    });

    return deletedPlayer;
  }
}

export { DeletePlayerService };