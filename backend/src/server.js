import express from "express"
import cors from "cors"

import createUserRouter from "./routes/createUserRouter.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/create", createUserRouter)

app.listen(3000, () => {
  console.log("Rodando na porta 3000")
})