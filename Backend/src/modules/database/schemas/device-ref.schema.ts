import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type DeviceRefDocument = DeviceRef & Document;

@Schema({ timestamps: true })
export class DeviceRef {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  dev_eui: string;

  @Prop({ required: true })
  application_chirpstack_id: string;

  @Prop({ required: true, unique: true })
  chirpstack_id: string;

  @Prop({ type: Object })
  meta?: any;
}

export const DeviceRefSchema = SchemaFactory.createForClass(DeviceRef);
