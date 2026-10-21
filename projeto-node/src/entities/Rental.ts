import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Car } from "./Car"; 

@Entity("rentals")
export class Rental {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  carId: string;

  @ManyToOne(() => Car)
  @JoinColumn({ name: "carId" })
  car: Car;

  @Column()
  userId: string;

  @Column({ type: "timestamp" })
  startDate: Date;

  @Column({ type: "timestamp", nullable: true })
  expectedReturnDate: Date;

  @Column({ type: "timestamp", nullable: true })
  endDate: Date;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  totalPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}