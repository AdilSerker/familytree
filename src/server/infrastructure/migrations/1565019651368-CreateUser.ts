import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUser1565019651368 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `create table account(
                id varchar primary key,
                login varchar not null,
                password varchar not null,
                person varchar references person(id)
            );`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`drop table account;`);
    }

}
