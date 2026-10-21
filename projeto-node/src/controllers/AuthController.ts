import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { generateToken } from "../jwt";
import bcrypt from "bcryptjs";

export class AuthController {
  async register(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;
    if (typeof name !== "string" || !name.trim() || typeof email !== "string" || !email.trim() || typeof password !== "string" || password.length < 8) {
      return res.status(400).json({ message: "Informe nome, e-mail e senha com no mínimo 8 caracteres" });
    }
    const users = AppDataSource.getRepository(User);
    if (await users.findOneBy({ email: email.trim().toLowerCase() })) {
      return res.status(409).json({ message: "E-mail já cadastrado" });
    }
    const user = users.create({ name: name.trim(), email: email.trim().toLowerCase(), password: await bcrypt.hash(password, 10) });
    await users.save(user);
    return res.status(201).json({ id: user.id, name: user.name, email: user.email });
  }

  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string") return res.status(400).json({ message: "E-mail e senha são obrigatórios" });
    const user = await AppDataSource.getRepository(User).createQueryBuilder("user")
      .addSelect("user.password").where("user.email = :email", { email: email.trim().toLowerCase() }).getOne();
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: "Credenciais inválidas" });
    return res.status(200).json({ accessToken: generateToken(user.id), tokenType: "Bearer", expiresIn: "1d" });
  }
}
