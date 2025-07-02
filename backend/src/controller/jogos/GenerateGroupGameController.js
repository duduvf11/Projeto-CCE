import { GenerateGroupGameService } from "../../service/jogos/GenerateGroupGameService.js";

class GenerateGroupGameController {
  async handle(req, res) {
    try {
      
      const { campeonatoId } = req.params; 

      if (isNaN(campeonatoId) || campeonatoId === null || campeonatoId === undefined) {
        return res.status(400).send({ message: "O 'campeonatoId' é inválido. Ele deve ser um número." });
      }

      const parsedCampeonatoId = parseInt(campeonatoId, 10);

      const generateGroup = new GenerateGroupGameService()

      const group = await generateGroup.execute({parsedCampeonatoId})

      return res.status(200).json(group)

    } catch (error) {

      console.error("Erro em GenerateGroupGameController:", error);
      return res.status(500).send({ message: "Ocorreu um erro interno no servidor." });
    }
  }
}

export { GenerateGroupGameController };