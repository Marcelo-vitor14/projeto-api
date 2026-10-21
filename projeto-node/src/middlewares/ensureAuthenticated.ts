import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../jwt";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export function ensureAuthenticated(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Token de autenticação não informado" });
    return;
  }
  try {
    const payload = verifyToken(authorization.slice(7));
    if (!payload.sub) throw new Error("Token sem usuário");
    req.userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ message: "Token inválido ou expirado" });
  }
}
