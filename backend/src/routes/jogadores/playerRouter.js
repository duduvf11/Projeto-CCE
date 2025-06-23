import {Router} from "express"
import { auth } from "../../middlewares/Auth.js";

import { GetPlayersByTeamController } from "../../controller/jogadores/GetPlayersByTeamController.js"
import { GetOnePlayerController } from "../../controller/jogadores/GetOnePlayerController.js"
import { CreateNewPlayerController } from "../../controller/jogadores/CreateNewPlayerController.js"
import { UpdatePlayerController } from "../../controller/jogadores/UpdatePlayerController.js"
import { DeletePlayerController } from "../../controller/jogadores/DeletePlayerController.js"

const router = Router()

//Novo Jogador
router.post("/time/:timeId", auth, new CreateNewPlayerController().handle)

//Lista de jogadores por time
router.get("/time/:timeId", new GetPlayersByTeamController().handle)

//Jogador especifico
router.get("/:id", new GetOnePlayerController().handle)

//Atualizar jogador
router.put("/:id", auth, new UpdatePlayerController().handle)

//Deletar jogador
router.delete("/:id", auth, new DeletePlayerController().handle)

export default router