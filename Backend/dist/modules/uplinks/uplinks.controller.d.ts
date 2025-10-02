import { UplinksService } from "./uplinks.service";
import { GetUplinksDto, GetDeviceUplinksDto } from "../../common/dto/uplink.dto";
export declare class UplinksController {
    private readonly uplinksService;
    constructor(uplinksService: UplinksService);
    findAll(query: GetUplinksDto): Promise<{
        success: boolean;
        count: number;
        data: (import("mongoose").Document<unknown, {}, import("../database/schemas").Uplink, {}, {}> & import("../database/schemas").Uplink & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
    }>;
    findByDevice(deviceId: string, query: GetDeviceUplinksDto): Promise<{
        success: boolean;
        device_id: string;
        count: number;
        data: (import("mongoose").Document<unknown, {}, import("../database/schemas").Uplink, {}, {}> & import("../database/schemas").Uplink & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
    }>;
    getStats(): Promise<{
        success: boolean;
        stats: {
            total_uplinks: number;
            unique_devices: number;
            unique_applications: number;
            uplinks_last_24h: number;
        };
    }>;
    getRecent(limit?: string): Promise<{
        success: boolean;
        count: number;
        data: (import("mongoose").Document<unknown, {}, import("../database/schemas").Uplink, {}, {}> & import("../database/schemas").Uplink & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
    }>;
    getApplications(): Promise<{
        success: boolean;
        count: number;
        data: any[];
    }>;
    getDevices(applicationId?: string): Promise<{
        success: boolean;
        count: number;
        data: any[];
    }>;
    simulate(body: {
        device_id: string;
        application_id: string;
        payload?: any;
        f_port?: number;
    }): Promise<{
        success: boolean;
        message: string;
        uplink_id: import("mongoose").Types.ObjectId;
        data: import("mongoose").Document<unknown, {}, import("../database/schemas").Uplink, {}, {}> & import("../database/schemas").Uplink & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
}
