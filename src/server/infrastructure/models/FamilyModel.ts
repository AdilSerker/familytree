import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity('family')
export class FamilyModel {
    @PrimaryColumn()
    public id: string;

    @Column()
    public name: string;
}