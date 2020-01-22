import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UmbrellaAssocService } from "./umbrellaAssoc.service";
import { UmbrellaAssocDto } from "./dto/umbrellaAssoc.dto";
import { UmbrellaAssocInput } from "./inputs/umbrellaAssoc.input";
import { User as CurrentUser } from "../decorators/user.decorator";
import { GraphqlAuthGuard } from "../guards/graphql-auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(GraphqlAuthGuard)
@Resolver('UmbrellaAssociation')
export class UmbrellaAssocResolver {
    constructor(private readonly uaService: UmbrellaAssocService) {}

    // ===========================================================================
    // Queries
    // ===========================================================================
   
    @Query(() => UmbrellaAssocDto, {description: 'Get an Umbrella Association by id'})
    async getUAById(@Args('id') id: string) {
        return this.uaService.findById(id);
    }

    @Query(() => [UmbrellaAssocDto], {description: 'Get an array with all Umbrella Associations'})
    async getAllUAs() {
        return this.uaService.findAll();
    }

    // ===========================================================================
    // Mutations
    // ===========================================================================
    
    @Mutation(() => UmbrellaAssocDto, {description: 'Create a new Umbrella Association'})
    async createUA(@Args('input') input: UmbrellaAssocInput) {
        try{ return this.uaService.create(input);
        } catch (error) { return error; }
    }

    @Mutation(() => UmbrellaAssocDto, {description: 'Updates an existing Umbrella Association'})
    async updateUA(@CurrentUser() user: any, @Args('id') id: string, @Args('input') input: UmbrellaAssocInput) {
        try{ return this.uaService.update(id, input, user.userId);
        } catch (error) { return error; }
    }

    @Mutation(() => Boolean, {description: 'Deletes an existing Umbrella Association'})
    async deleteUA(@CurrentUser() user: any, @Args('uaId') uaId: string) {
        try{ return this.uaService.delete(uaId, user.userId);
        } catch (error) { return error; }
    }

    @Mutation(() => Boolean)
    async addUaAdmin(@CurrentUser() user: any, @Args('uaId') uaId: string , @Args('userId') userId: string) {
        try{ return this.uaService.addAdmin(uaId, userId, user.userId);
        } catch (error) { return error; }
    }

    // ===========================================================================
    // Subscriptions
    // ===========================================================================

}