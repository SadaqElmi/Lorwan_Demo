import { Module } from "@nestjs/common";
import { ChirpstackModule } from "../chirpstack/chirpstack.module";
import { MqttModule } from "../mqtt/mqtt.module";
import { AuthModule } from "../auth/auth.module";
import { OrganizationsController } from "./organizations.controller";
import { ApplicationsController } from "./applications.controller";
import { DevicesController } from "./devices.controller";
import { DownlinksController } from "./downlinks.controller";

@Module({
  imports: [ChirpstackModule, MqttModule, AuthModule],
  controllers: [
    OrganizationsController,
    ApplicationsController,
    DevicesController,
    DownlinksController,
  ],
})
export class ApiModule {}
