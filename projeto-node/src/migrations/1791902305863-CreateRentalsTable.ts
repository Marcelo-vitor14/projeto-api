import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateRentalsTable1791897200000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "rentals",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "carId",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "userId",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "startDate",
                        type: "timestamp",
                        isNullable: false,
                    },
                    {
                        name: "expectedReturnDate",
                        type: "timestamp",
                        isNullable: true,
                    },
                    {
                        name: "endDate",
                        type: "timestamp",
                        isNullable: true,
                    },
                    {
                        name: "totalPrice",
                        type: "decimal",
                        precision: 10,
                        scale: 2,
                        isNullable: true,
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
                foreignKeys: [
                    new TableForeignKey({
                        name: "FKRentalCar",
                        columnNames: ["carId"],
                        referencedTableName: "cars", // Altere se renomeou a tabela de carros (ex: "veiculos")
                        referencedColumnNames: ["id"],
                        onDelete: "SET NULL",
                        onUpdate: "CASCADE",
                    }),
                ],
            }),
            true // Evita erros se a tabela já existir
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("rentals");
    }

}