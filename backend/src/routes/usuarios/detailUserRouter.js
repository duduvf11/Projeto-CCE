import { Router } from "express";
import { DetailUserController } from "../../controller/usuarios/DetailUserController.js";
import { auth } from "../../middlewares/Auth.js";

const router = Router()

router.get("/", auth, new DetailUserController().handle)

export default router

