import { ChirpstackService } from "./chirpstack.service";
declare class CreateTenantBody {
    name: string;
    meta?: any;
}
declare class CreateApplicationBody {
    name: string;
    tenant_id: string;
    meta?: any;
}
declare class CreateDeviceBody {
    name: string;
    dev_eui: string;
    application_id: string;
    meta?: any;
}
export declare class ChirpstackController {
    private readonly chirpstackService;
    constructor(chirpstackService: ChirpstackService);
    createTenant(body: CreateTenantBody): Promise<{
        success: boolean;
        tenant_id: string;
    }>;
    createApplication(body: CreateApplicationBody): Promise<{
        success: boolean;
        application_id: string;
    }>;
    createDevice(body: CreateDeviceBody): Promise<{
        success: boolean;
        device_id: string;
    }>;
}
export {};
