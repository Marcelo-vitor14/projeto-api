import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTables1791897192123 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        await queryRunner.createTable(
            new Table({
                name: "cars",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "brand",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "model",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "licensePlate",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "dailyRate",
                        type: "decimal",
                        precision: 10,
                        scale: 2,
                        isNullable: false,
                    },
                    {
                        name: "isAvailable",
                        type: "boolean",
                        default: true,
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
            }),
            true // <--- O segundo parâmetro 'true' ativa o "IF NOT EXISTS"
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("cars");
    }

}