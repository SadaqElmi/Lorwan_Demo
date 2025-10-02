import { Document } from "mongoose";
export type DeviceRefDocument = DeviceRef & Document;
export declare class DeviceRef {
    name: string;
    dev_eui: string;
    application_chirpstack_id: string;
    chirpstack_id: string;
    meta?: any;
}
export declare const DeviceRefSchema: import("mongoose").Schema<DeviceRef, import("mongoose").Model<DeviceRef, any, any, any, Document<unknown, any, DeviceRef, any, {}> & DeviceRef & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DeviceRef, Document<unknown, {}, import("mongoose").FlatRecord<DeviceRef>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<DeviceRef> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
