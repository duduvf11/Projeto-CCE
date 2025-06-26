import { Router } from "express";
import { GoalEventController } from "../../controller/eventos/GoalEventController.js";
import { RedCardEventController } from "../../controller/eventos/RedCardEventController.js";
import { YellowCardEventController } from "../../controller/eventos/YellowCardEventController.js";
import { AssistEventController } from "../../controller/eventos/AssistEventController.js";
import { OffsideEventController } from "../../controller/eventos/OffsideEventController.js";
import { PenaltiEventController } from "../../controller/eventos/PenaltiEventController.js";

const router = Router()

//Adicionar gol
router.post("/goal/:jogoId/:jogadorId/:time", new GoalEventController().handle)

//Adicionar cartão vermelho
router.post("/redCard/:jogoId/:jogadorId/:time", new RedCardEventController().handle)

//Adicionar cartão vermelho
router.post("/yellowCard/:jogoId/:jogadorId/:time", new YellowCardEventController().handle)

//Adicionar assistencia
router.post("/assist/:jogoId/:time", new AssistEventController().handle)

//Adicionar impedimento
router.post("/offside/:jogoId/:time", new OffsideEventController().handle)

//Adicionar penalti
router.post("/penalti/:jogoId/:time", new PenaltiEventController().handle)

//Adicionar finalizacao


export default router