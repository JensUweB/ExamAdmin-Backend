import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MartialArtsSchema } from "./martialArts.schema";
import { MartialArtsService } from "./martialArts.Service";

@Module({
    imports: [MongooseModule.forFeature([{name: 'User', schema: MartialArtsSchema}])],
    providers: [/* MartialArtsResolver */, MartialArtsService],
    exports: [MartialArtsService]
})
export class MartialArtsModule {}