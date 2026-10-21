import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("cars")
export class Car {
  @PrimaryGeneratedColumn("uuid")//lembrar oque e uuid//
  id: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  licensePlate: string;

  @Column("decimal", { precision: 10, scale: 2 })//lembrar oque e decimal,precision e scale//
  dailyRate: number;

  @Column({ default: true })
  isAvailable: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}