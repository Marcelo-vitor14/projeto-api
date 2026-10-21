import { Repository, IsNull } from "typeorm";
import { AppDataSource } from "../data-source";
import { Rental } from "../entities/Rental";
import { ICarRentalRepository, ICreateRentalDTO } from "./ICarRentalRepository";

export class CarRentalRepository implements ICarRentalRepository {
  private repository: Repository<Rental>;

  constructor() {
    this.repository = AppDataSource.getRepository(Rental);
  }

  //cria um novo registro de locação no banco
  async create({ carId, userId, startDate, expectedReturnDate }: ICreateRentalDTO): Promise<Rental> {
    const rental = this.repository.create({
      carId,
      userId,
      startDate,
      expectedReturnDate,
    });//lembrar onde e utilizado o repositorio sem ser na propria pasta

    await this.repository.save(rental);
    return rental;
  }

  // busca uma locação pelo id do contratante
  async findById(id: string): Promise<Rental | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ["car"],
    });
  }

  // verifica se o carro possui alguma locação em aberto,data de termino nula
  async findOpenRentalByCar(carId: string): Promise<Rental | null> {
    return await this.repository.findOne({
      where: { carId, endDate: IsNull() },
    });
  }

  // verifica se o usuário possui alguma locação em aberto,data de termino nula
  async findOpenRentalByUser(userId: string): Promise<Rental | null> {
    return await this.repository.findOne({
      where: { userId, endDate: IsNull() },
    });
  }

  // finaliza a locação inserindo a data de término e o valor total a ser pago
  async finalizeRental(id: string, endDate: Date, totalPrice: number): Promise<Rental> {
    const rental = await this.findById(id);

    if (!rental) {
      throw new Error("Locação não encontrada.");
    }

    rental.endDate = endDate;
    rental.totalPrice = totalPrice;

    await this.repository.save(rental);
    return rental;
  }

  // lista todas as locacoes cadastradas
  async listAll(): Promise<Rental[]> {
    return await this.repository.find({ relations: ["car"] });
  }
}