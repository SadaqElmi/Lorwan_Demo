import { Model } from "mongoose";
import { Uplink } from "../database/schemas/uplink.schema";
import { CreateDeviceDto } from "../../common/dto/uplink.dto";
export declare class DevicesService {
    private uplinkModel;
    constructor(uplinkModel: Model<Uplink>);
    findAll(): Promise<{
        success: boolean;
        devices: {
            device_id: any;
            total_uplinks: any;
            last_seen: any;
            first_seen: any;
            applications: any;
            payload_formats: any;
        }[];
    }>;
    create(createDeviceDto: CreateDeviceDto): Promise<{
        success: boolean;
        message: string;
        device: {
            device_id: string;
            application_id: string;
            test_uplink_id: import("mongoose").Types.ObjectId;
        };
    }>;
}
