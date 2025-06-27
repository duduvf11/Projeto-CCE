import { Router } from "express";
import { auth } from "../../middlewares/Auth.js";

import { CreateChampionshipController } from "../../controller/campeonato/CreateChampionshipController.js";
import { DeleteChampionshipController } from "../../controller/campeonato/DeleteChampionshipController.js";
import { UpdateChampionshipController } from "../../controller/campeonato/UpdateChampionshipController.js";
import { ListFinishedChampionshipsController } from "../../controller/campeonato/ListFinishedChampionshipsController.js";
import { ListOngoingChampionshipsController } from "../../controller/campeonato/ListOngoingChampionshipsController.js";
import { ListUpcomingChampionshipsController } from "../../controller/campeonato/ListUpcomingChampionshipsController.js";
import { GetChampionshipController } from "../../controller/campeonato/GetChampionshipController.js";
import { GetUserChampionshipController } from "../../controller/campeonato/GetUserChampionshipController.js";
import { JoinChampionshipController } from "../../controller/campeonato/JoinChampionshipController.js";
import { DeleteTeamChampionshipController } from "../../controller/campeonato/DeleteTeamChampionshipController.js";
import { GetChampionshipSubscribedController } from "../../controller/campeonato/GetChampionshipSubscribedController.js";

const router = Router();

//Listar campeonatos finalizados
router.get("/finished", new ListFinishedChampionshipsController().handle);

//Listar campeonatos em andamento
router.get("/ongoing", new ListOngoingChampionshipsController().handle);

//Listar campeonatos a começar
router.get("/upcoming", new ListUpcomingChampionshipsController().handle);

//Listar campeonatos que o usuário está inscrito
router.get("/subscribed", auth, new GetChampionshipSubscribedController().handle)

//Criar campeonato
router.post("/", auth, new CreateChampionshipController().handle);

//Entrar no campeonato
router.post("/:campeonatoId/time/:timeId", auth, new JoinChampionshipController().handle)

//Sair do campeonato
router.delete("/:campeonatoId/time/:timeId", auth, new DeleteTeamChampionshipController().handle)

//Deletar campeonato
router.delete("/:id", auth, new DeleteChampionshipController().handle);

//Atualizar campeonato
router.put("/:id", auth, new UpdateChampionshipController().handle);

//Listar campeonatos do usuario
router.get("/", auth, new GetUserChampionshipController().handle)

//Listar campeonato
router.get("/:id", new GetChampionshipController().handle)

//Mostrar um campeonato
router.get("/:id", new GetChampionshipController().handle);

export default router;