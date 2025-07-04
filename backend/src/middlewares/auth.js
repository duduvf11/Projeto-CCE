import jwt from "jsonwebtoken"
const {verify} = jwt

export function auth(req, res, next){

  const authToken = req.headers.authorization || req.cookies.token

  if (!authToken) return res.status(401).end()

  const token = authToken.startsWith?.("Bearer ")
    ? authToken.split(" ")[1]
    : authToken;

  try{

    const { sub } = verify(
      token,
    process.env.JWT_SECRET
  )

  req.user_id = sub

  return next()

  }catch{
    return res.status(401).end()
  }
}