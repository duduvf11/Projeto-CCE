import { Router } from "express";
import { auth } from "../../middlewares/Auth.js";

import { CreateTeam } from "../../controller/times/CreateTeamController.js";
import { GetTeamController } from "../../controller/times/GetTeamsController.js";
import { UpdateTeamController } from "../../controller/times/UpdateTeamController.js";
import { DeleteTeamController } from "../../controller/times/DeleteTeamController.js";
import { GetTeamsByChampionshipController } from "../../controller/times/GetTeamsByChampionshipController.js";

const router = Router()

//Novo time
router.post("/", auth, new CreateTeam().handle)

//Times do usuario
router.get("/", auth, new GetTeamController().handle)

//Times do campeonato
router.get("/:campeonatoId", new GetTeamsByChampionshipController().handle)

//Update time
router.put("/:id", auth, new UpdateTeamController().handle)

//Deleta time
router.delete("/:id", auth, new DeleteTeamController().handle)

export default router