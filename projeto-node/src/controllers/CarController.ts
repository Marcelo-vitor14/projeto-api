import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Car } from "../entities/Car";

export class CarController {
  async index(_req: Request, res: Response): Promise<Response> {
    const cars = await AppDataSource.getRepository(Car).find({ order: { createdAt: "DESC" } });
    return res.status(200).json(cars);
  }

  async show(req: Request, res: Response): Promise<Response> {
    const car = await AppDataSource.getRepository(Car).findOneBy({ id: req.params.id });
    return car ? res.status(200).json(car) : res.status(404).json({ message: "Carro não encontrado" });
  }

  async create(req: Request, res: Response): Promise<Response> {
    const { brand, model, licensePlate, dailyRate } = req.body;
    if (![brand, model, licensePlate].every((value) => typeof value === "string" && value.trim()) || !Number.isFinite(Number(dailyRate)) || Number(dailyRate) <= 0) {
      return res.status(400).json({ message: "Marca, modelo, placa e diária positiva são obrigatórios" });
    }
    const cars = AppDataSource.getRepository(Car);
    if (await cars.findOneBy({ licensePlate: licensePlate.trim().toUpperCase() })) return res.status(409).json({ message: "Placa já cadastrada" });
    const car = cars.create({ brand: brand.trim(), model: model.trim(), licensePlate: licensePlate.trim().toUpperCase(), dailyRate: Number(dailyRate) });
    await cars.save(car);
    return res.status(201).json(car);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const cars = AppDataSource.getRepository(Car);
    const car = await cars.findOneBy({ id: req.params.id });
    if (!car) return res.status(404).json({ message: "Carro não encontrado" });
    const { brand, model, licensePlate, dailyRate, isAvailable } = req.body;
    if (brand !== undefined) car.brand = brand;
    if (model !== undefined) car.model = model;
    if (licensePlate !== undefined) car.licensePlate = String(licensePlate).trim().toUpperCase();
    if (dailyRate !== undefined && Number(dailyRate) > 0) car.dailyRate = Number(dailyRate);
    if (typeof isAvailable === "boolean") car.isAvailable = isAvailable;
    await cars.save(car);
    return res.status(200).json(car);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const cars = AppDataSource.getRepository(Car);
    const car = await cars.findOneBy({ id: req.params.id });
    if (!car) return res.status(404).json({ message: "Carro não encontrado" });
    await cars.remove(car);
    return res.status(204).send();
  }
}
