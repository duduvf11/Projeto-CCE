import { CreateUserController } from "../controller/createUserController.js";
import { auth } from "../middlewares/Auth.js";

import { Router } from "express";

const router = Router();

router.post("/", auth, new CreateUserController().handle)

export default router;