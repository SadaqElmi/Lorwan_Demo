import { ConfigService } from "@nestjs/config";
import { Model } from "mongoose";
import { TenantRef, ApplicationRef, DeviceRef } from "../database/schemas";
import { ListTenantsResponse } from "@chirpstack/chirpstack-api/api/tenant_pb";
import { ListApplicationsResponse } from "@chirpstack/chirpstack-api/api/application_pb";
import { ListDevicesResponse } from "@chirpstack/chirpstack-api/api/device_pb";
import { ListDeviceProfilesResponse } from "@chirpstack/chirpstack-api/api/device_profile_pb";
export declare class ChirpstackService {
    private readonly configService;
    private tenantModel;
    private applicationModel;
    private deviceModel;
    private readonly tenantClient;
    private readonly applicationClient;
    private readonly deviceClient;
    private readonly deviceProfileClient;
    private readonly metadata;
    constructor(configService: ConfigService, tenantModel: Model<TenantRef>, applicationModel: Model<ApplicationRef>, deviceModel: Model<DeviceRef>);
    createTenant(name: string, meta?: any): Promise<{
        id: string;
        saved: import("mongoose").Document<unknown, {}, TenantRef, {}, {}> & TenantRef & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    listTenants(limit?: number, offset?: number, search?: string): Promise<ListTenantsResponse.AsObject>;
    updateTenant(id: string, fields: Partial<{
        name: string;
        description: string;
    }>): Promise<void>;
    deleteTenant(id: string): Promise<void>;
    createApplication(name: string, tenantId: string, meta?: any): Promise<{
        id: string;
        saved: import("mongoose").Document<unknown, {}, ApplicationRef, {}, {}> & ApplicationRef & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    listApplications(tenantId: string, limit?: number, offset?: number, search?: string): Promise<ListApplicationsResponse.AsObject>;
    updateApplication(id: string, fields: Partial<{
        name: string;
        description: string;
    }>): Promise<void>;
    deleteApplication(id: string): Promise<void>;
    createDevice(name: string, devEui: string, applicationId: string, meta?: any): Promise<{
        id: string;
        saved: import("mongoose").Document<unknown, {}, DeviceRef, {}, {}> & DeviceRef & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    listDevices(applicationId: string, limit?: number, offset?: number, search?: string): Promise<ListDevicesResponse.AsObject>;
    updateDevice(devEui: string, fields: Partial<{
        name: string;
        description: string;
        deviceProfileId: string;
    }>): Promise<void>;
    deleteDevice(devEui: string): Promise<void>;
    listDeviceProfiles(tenantId: string, limit?: number, offset?: number, search?: string): Promise<ListDeviceProfilesResponse.AsObject>;
    getDeviceProfile(id: string): Promise<any>;
    createDeviceProfile(name: string, tenantId: string, description?: string, region?: string): Promise<{
        id: string;
    }>;
    updateDeviceProfile(id: string, fields: Partial<{
        name: string;
        description: string;
        region: string;
    }>): Promise<void>;
    deleteDeviceProfile(id: string): Promise<void>;
}
