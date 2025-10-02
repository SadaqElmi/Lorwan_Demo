import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type DownlinkDocument = Downlink & Document;

@Schema({ timestamps: true })
export class Downlink {
  @Prop({ required: true })
  device_eui: string;

  @Prop({ required: true })
  application_id: string;

  @Prop({ required: true })
  f_port: number;

  @Prop({ required: true })
  data: string; // base64 encoded payload

  @Prop({ default: false })
  confirmed: boolean;

  @Prop({ default: "pending" })
  status: string; // pending, sent, acknowledged, failed

  @Prop({ type: Object })
  metadata?: any;

  @Prop({ required: true })
  sent_at: Date;

  @Prop()
  acknowledged_at?: Date;

  @Prop()
  error_message?: string;
}

export const DownlinkSchema = SchemaFactory.createForClass(Downlink);
