import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

import createUserRouter from "./routes/usuarios/createUserRouter.js"
import loginUserRouter from "./routes/usuarios/loginUserRouter.js"
import detailUserRouter from "./routes/usuarios/detailUserRouter.js"
import teamsRouter from "./routes/times/teamsRouter.js"
import playerRouter from "./routes/jogadores/playerRouter.js"
import championshipRouter from "./routes/campeonato/championshipRouter.js"

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json())
app.use(cookieParser())

app.use("/create", createUserRouter)
app.use("/login", loginUserRouter)
app.use("/me", detailUserRouter)
app.use("/team", teamsRouter)
app.use("/player", playerRouter)
app.use("/championship", championshipRouter)

app.listen(3000, () => {
  console.log("Rodando na porta 3000")
})