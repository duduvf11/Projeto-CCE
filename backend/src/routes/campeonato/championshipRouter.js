import { Router } from "express";

const router = Router()

router.get("/", (req, res) => {
  console.log("Campeonato")
  return res.status(200).end()
})

export default router