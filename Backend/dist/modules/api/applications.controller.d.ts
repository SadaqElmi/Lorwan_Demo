import { ChirpstackService } from "../chirpstack/chirpstack.service";
import { AuthService } from "../auth/auth.service";
export declare class ApplicationsController {
    private readonly chirp;
    private readonly authService;
    constructor(chirp: ChirpstackService, authService: AuthService);
    list(organizationId: string, limit?: string, offset?: string, search?: string): Promise<import("@chirpstack/chirpstack-api/api/application_pb").ListApplicationsResponse.AsObject>;
    create(body: {
        name: string;
        organizationId: string;
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
