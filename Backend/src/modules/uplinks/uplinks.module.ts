import { Module } from "@nestjs/common";
import { UplinksController } from "./uplinks.controller";
import { UplinksService } from "./uplinks.service";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [UplinksController],
  providers: [UplinksService],
})
export class UplinksModule {}
