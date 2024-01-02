import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1702224202239 implements MigrationInterface {
    name = 'Migration1702224202239'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tasks\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`dateTimeReminder\` datetime NOT NULL, \`status\` tinyint NOT NULL, \`time\` time NOT NULL, \`priority\` varchar(255) NOT NULL, \`category\` varchar(255) NOT NULL, \`usuarioId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tasks\` ADD CONSTRAINT \`FK_1ccdd5fe7c8cc99584213f99c31\` FOREIGN KEY (\`usuarioId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tasks\` DROP FOREIGN KEY \`FK_1ccdd5fe7c8cc99584213f99c31\``);
        await queryRunner.query(`DROP TABLE \`tasks\``);
    }

}
