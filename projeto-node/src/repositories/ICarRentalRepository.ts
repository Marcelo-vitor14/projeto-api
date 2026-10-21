import { Rental } from "../entities/Rental";

export interface ICreateRentalDTO {
  carId: string;
  userId: string;
  startDate: Date;
  expectedReturnDate?: Date;
}

export interface ICarRentalRepository {
  create(data: ICreateRentalDTO): Promise<Rental>;
  findById(id: string): Promise<Rental | null>;
  findOpenRentalByCar(carId: string): Promise<Rental | null>;
  findOpenRentalByUser(userId: string): Promise<Rental | null>;
  finalizeRental(id: string, endDate: Date, totalPrice: number): Promise<Rental>;
  listAll(): Promise<Rental[]>;
}
