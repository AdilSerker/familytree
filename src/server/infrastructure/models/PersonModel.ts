import { Entity, PrimaryColumn, Column, OneToMany, JoinTable, JoinColumn, ManyToOne } from "typeorm";

@Entity('person')
export class PersonModel {
    @PrimaryColumn()
    public id: string;

    @Column()
    public name: string;

    @Column()
    public born: string;

    @Column()
    public parentId: string;

    @Column()
    public family: string;

    @Column()
    public gender: string;

    @Column()
    public generation: number;

    @Column()
    public relationship: string;
}
