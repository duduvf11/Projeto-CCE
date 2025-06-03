import express from "express"

import loginRouter from "./routes/loginRouter.js"

const app = express()

app.use(express.json())

app.use("/login", loginRouter)

app.get("/", (req, res) => {
  res.json({msg: "ok"})
})

app.listen(3000, () => {
  console.log("Rodando na porta 3000")
})