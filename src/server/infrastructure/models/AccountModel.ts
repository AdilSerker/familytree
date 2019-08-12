import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { PersonModel } from "./PersonModel";

@Entity('account')
export class AccountModel {

    @PrimaryColumn()
    public id: string;

    @Column()
    public login: string;

    @Column()
    public password: string;

    @OneToOne(type => PersonModel)
    @JoinColumn()
    public person: PersonModel;
}