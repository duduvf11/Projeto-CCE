import { Router } from "express";
const router = Router();

const clack = 
{
  "Rodrigo": "Meu nome"
}

router.get("/", (req, res) => {
  res.json(clack);
});

export default router;