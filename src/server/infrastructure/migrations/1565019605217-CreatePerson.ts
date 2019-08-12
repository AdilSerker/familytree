import {MigrationInterface, QueryRunner} from "typeorm";

export class CreatePerson1565019605217 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `create table person(
                id varchar primary key,
                name varchar not null,
                born varchar,
                dob varchar,
                "parentId" varchar references person(id),
                family varchar references family(id),
                gender varchar not null,
                generation integer not null,
                relationship varchar references person(id)
            );`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`drop table person;`);
    }

}
