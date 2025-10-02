import { Model } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import { HttpService } from "@nestjs/axios";
import { UserDocument } from "../database/schemas/user.schema";
import { JwtPayload } from "./strategies/jwt.strategy";
export declare class AuthService {
    private userModel;
    private jwtService;
    private httpService;
    private keycloakUrl;
    private keycloakRealm;
    private keycloakClientId;
    private keycloakClientSecret;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService, httpService: HttpService);
    validateUser(payload: JwtPayload): Promise<UserDocument>;
    findUserById(id: string): Promise<UserDocument | null>;
    findUserByKeycloakId(keycloakId: string): Promise<UserDocument | null>;
    updateUserOrganizations(userId: string, organizationIds: string[]): Promise<UserDocument | null>;
    getUserOrganizations(userId: string): Promise<string[]>;
    hasAccessToOrganization(userId: string, organizationId: string): Promise<boolean>;
    isAdmin(userId: string): Promise<boolean>;
    generateToken(payload: any): string;
    private getKeycloakAdminToken;
    getKeycloakUsers(limit?: number, offset?: number): Promise<any>;
    getKeycloakUserCount(): Promise<number>;
}
