import { Service } from "typedi";
import { FamilyModel } from "../models/FamilyModel";
import { Family } from "../../domain/Family";

@Service()
export class FamilyFactory {
    public buildItem(model: FamilyModel): Family {
        return new Family(model.id, model.name);
    }
}
