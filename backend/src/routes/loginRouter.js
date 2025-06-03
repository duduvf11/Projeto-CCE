import { CreateUserController } from "../controller/createUserController.js";

import { Router } from "express";


const router = Router();

router.post("/", (req, res) => {
  req.body = {login, password}
  res.json();
});

//Criar novo usuario
router.post("/create", new CreateUserController().handle)

export default router;