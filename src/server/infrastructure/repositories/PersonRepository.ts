import { Service, Inject } from "typedi";
import { PersonModel } from "../models/PersonModel";
import { getRepository } from "typeorm";
import { Person } from "../../domain/Person";
import { PersonFactory } from "../factories/PersonFactory";

export type PersonQuery = {
    id?: string;
    family?: string;
    parentId?: string;
}

@Service()
export class PersonRepository {

    @Inject()
    private personFactory: PersonFactory;

    public async get(query: { id?: string, generation?: number }): Promise<Person> {
        const model = await getRepository(PersonModel).findOne({
            where: query
        });

        return this.personFactory.createItem(model);
    }

    public async getList(query: PersonQuery): Promise<Person[]> {
        const models = await getRepository(PersonModel).find({
            where: query
        });

        return this.personFactory.createList(models);
    }

    public async save(person: Person): Promise<void> {
        const children = person.children;

        await getRepository(PersonModel).save(person);

        if(children && children.length) {
            await Promise.all(children.map(item => this.save(item)));
        }

    }
    
}