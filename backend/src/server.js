import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

import createUserRouter from "./routes/usuarios/createUserRouter.js"
import loginUserRouter from "./routes/usuarios/loginUserRouter.js"
import detailUserRouter from "./routes/usuarios/detailUserRouter.js"
import teamsRouter from "./routes/times/teamsRouter.js"
import playerRouter from "./routes/jogadores/playerRouter.js"
import championshipRouter from "./routes/campeonato/championshipRouter.js"
import gameRouter from "./routes/jogos/gameRouter.js"
import eventsRouter from "./routes/eventos/eventsRouter.js"

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use("/create", createUserRouter)
app.use("/login", loginUserRouter)
app.use("/me", detailUserRouter)
app.use("/team", teamsRouter)
app.use("/player", playerRouter)
app.use("/championship", championshipRouter)
app.use("/game", gameRouter)
app.use("/events", eventsRouter)

app.listen(3000, () => {
  console.log("Rodando na porta 3000")
})