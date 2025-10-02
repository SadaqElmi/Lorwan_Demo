import { ConfigService } from "@nestjs/config";
import { Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
export interface JwtPayload {
    sub: string;
    preferred_username: string;
    email: string;
    given_name?: string;
    family_name?: string;
    realm_access?: {
        roles: string[];
    };
    resource_access?: {
        [clientId: string]: {
            roles: string[];
        };
    };
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly configService;
    private readonly authService;
    private jwksClient;
    constructor(configService: ConfigService, authService: AuthService);
    private getKeycloakPublicKey;
    validate(payload: JwtPayload): Promise<import("../../database/schemas").UserDocument>;
}
export {};
