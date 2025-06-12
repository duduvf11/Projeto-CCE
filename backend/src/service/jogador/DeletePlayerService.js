import prismaClient from "../../prisma/index.js";

class DeletePlayerService {
  async execute({}) {
    console.log("DeletePlayerService");
    return;
  }
}

export { DeletePlayerService };