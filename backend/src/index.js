import express, { json } from "express"

import loginRouter from "./routes/login.js"

const app = express()

app.use(express.json())

app.use("/login", loginRouter)

app.listen(3000, () => {
  console.log("Rodando na porta 3000")
})