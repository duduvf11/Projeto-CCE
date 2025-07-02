import {Router} from "express"
import { GenerateGameController } from "../../controller/jogos/GenerateGameController.js"
import { DeleteGamesController } from "../../controller/jogos/DeleteGamesController.js"
import { StartGameController } from "../../controller/jogos/StartGameController.js"
import { UpdateGameController } from "../../controller/jogos/UpdateGameController.js"
import { GetGameController } from "../../controller/jogos/GetGamesController.js"
import { GenerateGroupGameController } from "../../controller/jogos/GenerateGroupGameController.js"

const router = Router()

//Criar jogos do mata-mata
router.post("/playoff/:campeonatoId", new GenerateGameController().handle)

//Criar jogos da fase de grupos
router.post("/group/:campeonatoId", new GenerateGroupGameController().handle)

//Deletar os jogos do campeonato
router.delete("/:campeonatoId", new DeleteGamesController().handle)

//Iniciar jogo
router.post("/create/:jogoId", new StartGameController().handle)

//Avançar jogo
router.post("/advance/:jogoId", new UpdateGameController().handle)

//Resgatar partidas do campeonato
router.get("/:campeonatoIds", new GetGameController().handle)

export default router
