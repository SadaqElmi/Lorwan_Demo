import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./modules/database/database.module";
import { MqttModule } from "./modules/mqtt/mqtt.module";
import { UplinksModule } from "./modules/uplinks/uplinks.module";
import { DevicesModule } from "./modules/devices/devices.module";
import { ApplicationsModule } from "./modules/applications/applications.module";
import { ChirpstackModule } from "./modules/chirpstack/chirpstack.module";
import { ApiModule } from "./modules/api/api.module";
import { AuthModule } from "./modules/auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL || ""),
    DatabaseModule,
    AuthModule,
    MqttModule,
    UplinksModule,
    DevicesModule,
    ApplicationsModule,
    ChirpstackModule,
    ApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
