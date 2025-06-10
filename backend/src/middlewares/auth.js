import jwt from "jsonwebtoken"
const {verify} = jwt

export function auth(req, res, next){

  const authToken = req.headers.authorization

  if (!authToken) return res.status(401).end()

  const [, token] = authToken.split(" ")

  try{

    const { sub } = verify(
      token,
    process.env.JWT_SECRET
  )

  req.user_id = sub

  return next()

  }catch{
    return res.stauts(401).end()
  }
}