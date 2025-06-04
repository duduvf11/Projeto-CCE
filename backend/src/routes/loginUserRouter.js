import { Router } from "express";

import { LoginUserController } from "../controller/LoginUserController.js";

const app = Router()

app.post("/", new LoginUserController().handle)

export default app