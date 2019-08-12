import { JsonController, Get, Param, Res, Post, Body } from "routing-controllers";
import { Inject } from "typedi";

import { PersonRepository, FamilyRepository } from "../../infrastructure/repositories";
import { PersonForm, PersonChildForm, PersonRelationshipForm } from "../../types";
import { Person } from "../../domain/Person";
import { v4 } from "uuid";
import { Family } from "../../domain/Family";

@JsonController('/api/person')
export class PersonController {

    @Inject()
    private personRepository: PersonRepository;
    @Inject()
    private familyRepository: FamilyRepository;

    @Get('/:id')
    public async getPerson(
        @Param('id') id: string
    ): Promise<Person> {
        const person = await this.personRepository.get({ id });

        return person;
    }

    @Post('/')
    public async createPerson(
        @Body() form: PersonForm
    ): Promise<Person> {
        const person = new Person({ ...form, id: v4() });

        await this.personRepository.save(person);

        return person;
    }

    @Post('/:id/child')
    public async addPersonChild(
        @Param('id') id: string,
        @Body() form: PersonChildForm
    ): Promise<Person> {
        const person = await this.personRepository.get({ id });

        // if (!person.relationship) {
        //     throw Error('not found relationship');
        // }

        const child = new Person({
            ...form,
            id: v4(),
            generation: person.generation + 1,
            family: person.family,
            parentId: person.id
        });

        await this.personRepository.save(child);

        return child;
    }

    @Post('/:id/relationship')
    public async addPersonRelationship(
        @Param('id') id: string,
        @Body() form: PersonRelationshipForm
    ): Promise<Person> {
        const person = await this.personRepository.get({ id });

        const family = new Family(v4(), form.familyName);
        await this.familyRepository.save(family);

        const relationshipPerson = new Person({
            ...form,
            id: v4(),
            generation: 1,
            family: family.id,
            relationship: person.id
        });
        
        await this.personRepository.save(relationshipPerson);

        person.relationship = relationshipPerson.id;
        await this.personRepository.save(person);

        return relationshipPerson;
    }

    @Post('/parent')
    public async addPersonParent(
        @Body() form: PersonForm
    ): Promise<Person> {
        const person = await this.personRepository.get({ generation: 1 });

        if (person.parentId) {
            throw new Error('parent already exist');
        }

        const parent = new Person({
            ...form,
            id: v4(),
            generation: 0
        });
        await this.personRepository.save(parent);

        person.parentId = parent.id;
        await this.personRepository.save(person);

        const allFamPerson = await this.personRepository.getList({ family: person.family });
        allFamPerson.forEach(item => item.generation += 1);
        await Promise.all(allFamPerson.map(item => this.personRepository.save(item)));

        return parent;
    }

}