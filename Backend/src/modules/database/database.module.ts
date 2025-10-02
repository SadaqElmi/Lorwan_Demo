import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Uplink, UplinkSchema } from "./schemas/uplink.schema";
import { User, UserSchema } from "./schemas/user.schema";
import { Downlink, DownlinkSchema } from "./schemas/downlink.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Uplink.name, schema: UplinkSchema },
      { name: User.name, schema: UserSchema },
      { name: Downlink.name, schema: DownlinkSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
