import { Service, Inject } from "typedi";
import { getRepository } from "typeorm";
import { FamilyModel } from "../models/FamilyModel";
import { Family } from "../../domain/Family";
import { FamilyFactory } from "../factories/FamilyFacroty";

@Service()
export class FamilyRepository {

    @Inject()
    private familyFactory: FamilyFactory;

    public async get(id: string): Promise<Family> {
        const model = await getRepository(FamilyModel).findOne({
            where: { id }
        });
        if (!model) {
            throw new Error("family not found");
        }

        return this.familyFactory.buildItem(model);
    }

    public async save(family: Family): Promise<Family> {
        const model = await getRepository(FamilyModel).save(family);

        return this.familyFactory.buildItem(model);
    }
}