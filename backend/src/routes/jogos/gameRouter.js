import {Router} from "express"
import { GenerateGameController } from "../../controller/jogos/GenerateGameController.js"
import { DeleteGamesController } from "../../controller/jogos/DeleteGamesController.js"
import { StartGameController } from "../../controller/jogos/StartGameController.js"
import { GetGameController } from "../../controller/jogos/GetGameController.js"
import { auth } from "../../middlewares/Auth.js"

const router = Router()

//Criar jogos do campeonato
router.post("/:campeonatoId", auth, new GenerateGameController().handle)

//Deletar os jogos do campeonato
router.delete("/:campeonatoId", new DeleteGamesController().handle)

//Iniciar jogo
router.post("/create/:jogoId", new StartGameController().handle)

//Buscar jogos do campeonato
router.get("/:campeonatoIds", new GetGameController().handle)

export default router