import { ChirpstackService } from "../chirpstack/chirpstack.service";
import { AuthService } from "../auth/auth.service";
export declare class DevicesController {
    private readonly chirp;
    private readonly authService;
    constructor(chirp: ChirpstackService, authService: AuthService);
    list(applicationId: string, limit?: string, offset?: string, search?: string): Promise<import("@chirpstack/chirpstack-api/api/device_pb").ListDevicesResponse.AsObject>;
    listProfiles(tenantId: string, limit?: string, offset?: string, search?: string): Promise<import("@chirpstack/chirpstack-api/api/device_profile_pb").ListDeviceProfilesResponse.AsObject>;
    getProfile(id: string): Promise<any>;
    create(body: {
        name: string;
        devEui: string;
        applicationId: string;
        description?: string;
        deviceProfileId?: string;
        meta?: any;
    }): Promise<{
        id: string;
    }>;
    update(devEui: string, body: {
        name?: string;
        description?: string;
        deviceProfileId?: string;
    }): Promise<{
        success: boolean;
    }>;
    remove(devEui: string): Promise<{
        success: boolean;
    }>;
    createProfile(body: {
        name: string;
        tenantId: string;
        description?: string;
        region?: string;
    }): Promise<{
        id: string;
    }>;
    updateProfile(id: string, body: {
        name?: string;
        description?: string;
        region?: string;
    }): Promise<{
        success: boolean;
    }>;
    removeProfile(id: string): Promise<{
        success: boolean;
    }>;
}
