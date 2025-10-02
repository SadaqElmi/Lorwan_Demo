import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { HttpModule } from "@nestjs/axios";
import {
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
  AuthGuard,
} from "nest-keycloak-connect";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { User, UserSchema } from "../database/schemas/user.schema";

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET") || "fallback-secret",
        signOptions: {
          expiresIn: configService.get<string>("JWT_EXPIRES_IN") || "24h",
        },
      }),
      inject: [ConfigService],
    }),
    KeycloakConnectModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        authServerUrl:
          configService.get<string>("KEYCLOAK_AUTH_SERVER_URL") ||
          "http://localhost:9090",
        realm: configService.get<string>("KEYCLOAK_REALM") || "lorawan",
        clientId:
          configService.get<string>("KEYCLOAK_CLIENT_ID") || "lorawan-backend",
        secret: configService.get<string>("KEYCLOAK_CLIENT_SECRET") || "",
        cookieKey: "KEYCLOAK_JWT",
        logLevels: ["verbose"],
        useNestLogger: true,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    // Global guards - using only JWT strategy for now
    // {
    //   provide: "APP_GUARD",
    //   useClass: AuthGuard,
    // },
    // {
    //   provide: "APP_GUARD",
    //   useClass: ResourceGuard,
    // },
    // {
    //   provide: "APP_GUARD",
    //   useClass: RoleGuard,
    // },
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
