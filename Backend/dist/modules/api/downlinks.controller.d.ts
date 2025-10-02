import { MqttService } from "../mqtt/mqtt.service";
import { SendDownlinkDto, GetDownlinksDto } from "../../common/dto/downlink.dto";
export declare class DownlinksController {
    private readonly mqttService;
    constructor(mqttService: MqttService);
    list(query: GetDownlinksDto): Promise<{
        success: boolean;
        count: number;
        data: (import("mongoose").Document<unknown, {}, import("../database/schemas").Downlink, {}, {}> & import("../database/schemas").Downlink & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
    }>;
    send(body: SendDownlinkDto): Promise<{
        success: boolean;
        downlink_id: string;
        message: string;
    }>;
    sendRaw(body: {
        device_eui: string;
        application_id: string;
        f_port: number;
        data: string;
        confirmed?: boolean;
    }): Promise<{
        success: boolean;
        downlink_id: string;
        message: string;
    }>;
}
