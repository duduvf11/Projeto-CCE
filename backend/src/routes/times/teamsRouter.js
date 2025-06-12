import { Router } from "express";
import { auth } from "../../middlewares/auth.js";

import { CreateTeam } from "../../controller/times/CreateTeamController.js";

const router = Router()

router.post("/", auth, new CreateTeam().handle)

export default router