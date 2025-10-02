import { Document } from "mongoose";
export type TenantRefDocument = TenantRef & Document;
export declare class TenantRef {
    name: string;
    chirpstack_id: string;
    meta?: any;
}
export declare const TenantRefSchema: import("mongoose").Schema<TenantRef, import("mongoose").Model<TenantRef, any, any, any, Document<unknown, any, TenantRef, any, {}> & TenantRef & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TenantRef, Document<unknown, {}, import("mongoose").FlatRecord<TenantRef>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<TenantRef> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
