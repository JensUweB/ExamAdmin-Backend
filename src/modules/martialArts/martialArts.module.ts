import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MartialArtSchema } from "./martialArts.schema";
import { MartialArtsService } from "./martialArts.Service";
import { MartialArtsResolver } from "./martialArts.resolver";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [
        MongooseModule.forFeature([{name: 'MartialArt', schema: MartialArtSchema}]),
        forwardRef(() => AuthModule)
    ],
    providers: [MartialArtsResolver, MartialArtsService],
    exports: [MartialArtsService]
})
export class MartialArtsModule {}