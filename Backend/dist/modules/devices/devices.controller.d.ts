import { DevicesService } from "./devices.service";
import { CreateDeviceDto } from "../../common/dto/uplink.dto";
export declare class DevicesController {
    private readonly devicesService;
    constructor(devicesService: DevicesService);
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
