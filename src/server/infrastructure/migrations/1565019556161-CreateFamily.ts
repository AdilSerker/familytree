import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateFamily1565019556161 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `create table family(
                id varchar primary key,
                name varchar not null
            );`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `drop table family;`
        );
    }

}
