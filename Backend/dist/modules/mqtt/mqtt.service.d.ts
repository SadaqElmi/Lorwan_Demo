import { OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { Model } from "mongoose";
import { Uplink, Downlink } from "../database/schemas";
export declare class MqttService implements OnModuleInit, OnModuleDestroy {
    private uplinkModel;
    private downlinkModel;
    private readonly logger;
    private mqttClient;
    constructor(uplinkModel: Model<Uplink>, downlinkModel: Model<Downlink>);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private handleMessage;
    private parsePayload;
    private extractDeviceIdFromTopic;
    private extractApplicationIdFromTopic;
    sendDownlink(applicationId: string, deviceEui: string, fPort: number, data: string, confirmed?: boolean): Promise<string>;
    getDownlinks(filter: {
        limit?: number;
        device_eui?: string;
        application_id?: string;
        status?: string;
    }): Promise<{
        success: boolean;
        count: number;
        data: (import("mongoose").Document<unknown, {}, Downlink, {}, {}> & Downlink & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
    }>;
    hexToBase64(hex: string): string;
    base64ToHex(base64: string): string;
}
