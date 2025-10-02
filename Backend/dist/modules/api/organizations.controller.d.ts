import { ChirpstackService } from "../chirpstack/chirpstack.service";
import { AuthService } from "../auth/auth.service";
export declare class OrganizationsController {
    private readonly chirp;
    private readonly authService;
    constructor(chirp: ChirpstackService, authService: AuthService);
    list(req: any, limit?: string, offset?: string, search?: string): Promise<import("@chirpstack/chirpstack-api/api/tenant_pb").ListTenantsResponse.AsObject | {
        totalCount: number;
        resultList: {
            id: string;
            name: string;
            description: string;
            createdAt: {
                seconds: number;
                nanos: number;
            };
            updatedAt: {
                seconds: number;
                nanos: number;
            };
            canHaveGateways: boolean;
            maxGatewayCount: number;
            maxDeviceCount: number;
        }[];
    }>;
    create(body: {
        name: string;
        description?: string;
        meta?: any;
    }): Promise<{
        id: string;
    }>;
    update(id: string, body: {
        name?: string;
        description?: string;
    }): Promise<{
        success: boolean;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
