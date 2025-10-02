import { Document } from "mongoose";
export type DownlinkDocument = Downlink & Document;
export declare class Downlink {
    device_eui: string;
    application_id: string;
    f_port: number;
    data: string;
    confirmed: boolean;
    status: string;
    metadata?: any;
    sent_at: Date;
    acknowledged_at?: Date;
    error_message?: string;
}
export declare const DownlinkSchema: import("mongoose").Schema<Downlink, import("mongoose").Model<Downlink, any, any, any, Document<unknown, any, Downlink, any, {}> & Downlink & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Downlink, Document<unknown, {}, import("mongoose").FlatRecord<Downlink>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Downlink> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
