import { Router } from "express";
import { GoalEventController } from "../../controller/eventos/GoalEventController.js";
import { RedCardEventController } from "../../controller/eventos/RedCardEventController.js";

const router = Router()

//Adicionar gol
router.post("/goal/:jogoId/:jogadorId/:time", new GoalEventController().handle)

//Adicionar cartão vermelho
router.post("/redCard/:jogoId/:jogadorId/:time", new RedCardEventController().handle)

export default router