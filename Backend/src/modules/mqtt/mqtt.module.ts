import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MqttService } from "./mqtt.service";
import { DatabaseModule } from "../database/database.module";
import {
  Uplink,
  UplinkSchema,
  Downlink,
  DownlinkSchema,
} from "../database/schemas";

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Uplink.name, schema: UplinkSchema },
      { name: Downlink.name, schema: DownlinkSchema },
    ]),
  ],
  providers: [MqttService],
  exports: [MqttService],
})
export class MqttModule {}
