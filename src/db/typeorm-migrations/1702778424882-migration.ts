import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1702778424882 implements MigrationInterface {
    name = 'Migration1702778424882'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tasks\` ADD \`idNotification\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tasks\` DROP COLUMN \`idNotification\``);
    }

}
