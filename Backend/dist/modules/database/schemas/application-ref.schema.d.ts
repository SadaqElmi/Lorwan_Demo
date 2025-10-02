import { Document } from "mongoose";
export type ApplicationRefDocument = ApplicationRef & Document;
export declare class ApplicationRef {
    name: string;
    tenant_chirpstack_id: string;
    chirpstack_id: string;
    meta?: any;
}
export declare const ApplicationRefSchema: import("mongoose").Schema<ApplicationRef, import("mongoose").Model<ApplicationRef, any, any, any, Document<unknown, any, ApplicationRef, any, {}> & ApplicationRef & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ApplicationRef, Document<unknown, {}, import("mongoose").FlatRecord<ApplicationRef>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ApplicationRef> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
