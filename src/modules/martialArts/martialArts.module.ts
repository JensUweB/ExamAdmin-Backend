import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MartialArtSchema } from "./martialArts.schema";
import { MartialArtsService } from "./martialArts.Service";
import { MartialArtsResolver } from "./martialArts.resolver";

@Module({
    imports: [MongooseModule.forFeature([{name: 'MartialArt', schema: MartialArtSchema}])],
    providers: [MartialArtsResolver, MartialArtsService],
    exports: [MartialArtsService]
})
export class MartialArtsModule {}