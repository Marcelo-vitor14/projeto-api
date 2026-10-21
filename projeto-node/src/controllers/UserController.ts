import { Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { AuthenticatedRequest } from "../middlewares/ensureAuthenticated";

export class UserController {
  async me(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const user = await AppDataSource.getRepository(User).findOneBy({ id: req.userId });
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
    return res.status(200).json({ id: user.id, name: user.name, email: user.email });
  }
}
