import express from "express"
import cors from "cors"

import createUserRouter from "./routes/createUserRouter.js"
import loginUserRouter from "./routes/loginUserRouter.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/create", createUserRouter)

app.use("/login", loginUserRouter)

app.listen(3000, () => {
  console.log("Rodando na porta 3000")
})