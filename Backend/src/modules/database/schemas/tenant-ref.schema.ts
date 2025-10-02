import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type TenantRefDocument = TenantRef & Document;

@Schema({ timestamps: true })
export class TenantRef {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  chirpstack_id: string;

  @Prop({ type: Object })
  meta?: any;
}

export const TenantRefSchema = SchemaFactory.createForClass(TenantRef);
