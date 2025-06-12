import { Router } from "express";
import { auth } from "../../middlewares/auth.js";

import { CreateTeam } from "../../controller/times/CreateTeamController.js";
import { GetTeamController } from "../../controller/times/GetTeamsController.js";

const router = Router()

//Novo time
router.post("/", auth, new CreateTeam().handle)

//Times do usuario
router.get("/", auth, new GetTeamController().handle)

export default router