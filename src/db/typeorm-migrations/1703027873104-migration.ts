import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1703027873104 implements MigrationInterface {
    name = 'Migration1703027873104'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`gender\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`gender\``);
    }

}
