import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1703028263154 implements MigrationInterface {
    name = 'Migration1703028263154'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tasks\` DROP COLUMN \`gender\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tasks\` ADD \`gender\` varchar(255) NOT NULL`);
    }

}
