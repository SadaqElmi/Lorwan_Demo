import { Model } from "mongoose";
import { Uplink } from "../database/schemas/uplink.schema";
import { GetUplinksDto } from "../../common/dto/uplink.dto";
export declare class UplinksService {
    private uplinkModel;
    constructor(uplinkModel: Model<Uplink>);
    findAll(query: GetUplinksDto): Promise<{
        success: boolean;
        count: number;
        data: (import("mongoose").Document<unknown, {}, Uplink, {}, {}> & Uplink & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
    }>;
    findByDevice(deviceId: string, limit?: number): Promise<{
        success: boolean;
        device_id: string;
        count: number;
        data: (import("mongoose").Document<unknown, {}, Uplink, {}, {}> & Uplink & {
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
    findRecent(limit?: number): Promise<{
        success: boolean;
        count: number;
        data: (import("mongoose").Document<unknown, {}, Uplink, {}, {}> & Uplink & {
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
    simulateUplink(data: {
        device_id: string;
        application_id: string;
        payload?: any;
        f_port?: number;
    }): Promise<{
        success: boolean;
        message: string;
        uplink_id: import("mongoose").Types.ObjectId;
        data: import("mongoose").Document<unknown, {}, Uplink, {}, {}> & Uplink & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
}
