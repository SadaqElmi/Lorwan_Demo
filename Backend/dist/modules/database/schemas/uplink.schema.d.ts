import { Document } from "mongoose";
export type UplinkDocument = Uplink & Document;
export declare class Uplink {
    topic: string;
    payload: any;
    ts: Date;
    device_id: string;
    application_id: string;
}
export declare const UplinkSchema: import("mongoose").Schema<Uplink, import("mongoose").Model<Uplink, any, any, any, Document<unknown, any, Uplink, any, {}> & Uplink & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Uplink, Document<unknown, {}, import("mongoose").FlatRecord<Uplink>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Uplink> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
