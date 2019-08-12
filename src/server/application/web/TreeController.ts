import { JsonController, Get, Param, Res, Post, Body } from "routing-controllers";

import { TreeView, TreeFrom } from "../../types";
import { Inject } from "typedi";
import { FamilyRepository, PersonRepository } from "../../infrastructure/repositories";
import { v4 } from "uuid";
import { Family } from "../../domain/Family";

@JsonController("/api/tree")
export class TreeController {

    @Inject()
    private familyRepository: FamilyRepository;
    @Inject()
    private personRepository: PersonRepository;

    @Get("/:familyId")
    public async getTree(
        @Param('familyId') familyId: string
    ): Promise<any> {
        const family = await this.familyRepository.get(familyId);
        if (!family) {
            return {};
        }

        const personTree = await this.personRepository.getList({ family: familyId });

        return {
            familyId: family.id,
            familyName: family.name,
            nodes: personTree
        };

    } 

    @Post('/')
    public async createTree(
        @Body() form: TreeFrom
    ): Promise<any> {
        const family = new Family(v4(), form.name);
        
        return this.familyRepository.save(family);
    }
}
