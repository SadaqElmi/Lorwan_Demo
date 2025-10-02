import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ChirpstackService } from "./chirpstack.service";
import { ChirpstackController } from "./chirpstack.controller";
import {
  TenantRef,
  TenantRefSchema,
  ApplicationRef,
  ApplicationRefSchema,
  DeviceRef,
  DeviceRefSchema,
} from "../database/schemas";

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: TenantRef.name, schema: TenantRefSchema },
      { name: ApplicationRef.name, schema: ApplicationRefSchema },
      { name: DeviceRef.name, schema: DeviceRefSchema },
    ]),
  ],
  providers: [ChirpstackService],
  controllers: [ChirpstackController],
  exports: [ChirpstackService],
})
export class ChirpstackModule {}
