import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Category } from "../entities/Category";


export class CategoryController {
  async index(_req: Request, res: Response): Promise<Response> {
    const categories = await AppDataSource.getRepository(Category).find({ order: { name: "ASC" } });
    return res.status(200).json(categories);
  }

  async create(req: Request, res: Response): Promise<Response> {
    const { name, description } = req.body;
    if (typeof name !== "string" || !name.trim()) return res.status(400).json({ message: "Nome da categoria é obrigatório" });
    const repository = AppDataSource.getRepository(Category);
    const normalizedName = name.trim();
    if (await repository.findOneBy({ name: normalizedName })) return res.status(409).json({ message: "Categoria já cadastrada" });
    const category = repository.create({ name: normalizedName, description: typeof description === "string" ? description.trim() : null });
    await repository.save(category);
    return res.status(201).json(category);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const repository = AppDataSource.getRepository(Category);
    const category = await repository.findOneBy({ id: req.params.id });
    if (!category) return res.status(404).json({ message: "Categoria não encontrada" });
    const { name, description } = req.body;
    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) return res.status(400).json({ message: "Nome inválido" });
      category.name = name.trim();
    }
    if (description !== undefined) category.description = typeof description === "string" ? description.trim() : null;
    await repository.save(category);
    return res.status(200).json(category);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const repository = AppDataSource.getRepository(Category);
    const category = await repository.findOneBy({ id: req.params.id });
    if (!category) return res.status(404).json({ message: "Categoria não encontrada" });
    await repository.remove(category);
    return res.status(204).send();
  }
}
