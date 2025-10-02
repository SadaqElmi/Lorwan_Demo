import { Model } from "mongoose";
import { Uplink } from "../database/schemas/uplink.schema";
export declare class ApplicationsService {
    private uplinkModel;
    constructor(uplinkModel: Model<Uplink>);
    findAll(): Promise<{
        success: boolean;
        applications: {
            application_id: any;
            total_uplinks: any;
            device_count: any;
            last_seen: any;
            first_seen: any;
        }[];
    }>;
}
