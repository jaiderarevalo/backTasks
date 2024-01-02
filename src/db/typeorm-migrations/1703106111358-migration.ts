import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1703106111358 implements MigrationInterface {
    name = 'Migration1703106111358'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tasks\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`tasks\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`tasks\` ADD \`deletedAt\` datetime(6) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tasks\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`tasks\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`tasks\` DROP COLUMN \`createdAt\``);
    }

}
