export interface CreateRentalDTO {
  carId: string;
  userId: string;
  startDate: Date;
  expectedReturnDate: Date;
}