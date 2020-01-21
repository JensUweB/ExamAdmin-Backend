import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "../auth/auth.module";
import { UmbrellaAssocService } from "./umbrellaAssoc.service";
import { UmbrellaAssocResolver } from "./umbrellaAssoc.resolver";
import { UmbrellaAssocSchema } from "./umbrellaAssoc.schema";

@Module({
    imports: [
        MongooseModule.forFeature([{name: 'UmbrellaAssociation', schema: UmbrellaAssocSchema}]),
        forwardRef(() => AuthModule)
    ],
    providers: [UmbrellaAssocResolver, UmbrellaAssocService],
    exports: [UmbrellaAssocService]
})
export class UmbrellaAssocModule {}