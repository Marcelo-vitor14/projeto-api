import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function generateToken(userId: string): string {
  if (!JWT_SECRET) throw new Error("JWT_SECRET não configurado");
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "1d" });
}

export function verifyToken(token: string): JwtPayload {
  if (!JWT_SECRET) throw new Error("JWT_SECRET não configurado");
  const payload = jwt.verify(token, JWT_SECRET);
  if (typeof payload === "string") throw new Error("Token inválido");
  return payload;
}
