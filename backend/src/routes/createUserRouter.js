import { CreateUserController } from "../controller/createUserController.js";
import { Router } from "express";

const router = Router();

router.post("/", new CreateUserController().handle)

export default router;