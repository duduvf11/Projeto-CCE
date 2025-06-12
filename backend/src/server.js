import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

import createUserRouter from "./routes/usuarios/createUserRouter.js"
import loginUserRouter from "./routes/usuarios/loginUserRouter.js"
import detailUserRouter from "./routes/usuarios/detailUserRouter.js"
import teamsUserRouter from "./routes/times/teamsRouter.js"

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use("/create", createUserRouter)
app.use("/login", loginUserRouter)
app.use("/me", detailUserRouter)
app.use("/team", teamsUserRouter)

app.listen(3000, () => {
  console.log("Rodando na porta 3000")
})