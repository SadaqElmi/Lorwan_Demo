import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UplinkDocument = Uplink & Document;

@Schema({ timestamps: true })
export class Uplink {
  @Prop({ required: true })
  topic: string;

  @Prop({ type: Object, required: true })
  payload: any;

  @Prop({ required: true })
  ts: Date;

  @Prop({ required: true })
  device_id: string;

  @Prop({ required: true })
  application_id: string;
}

export const UplinkSchema = SchemaFactory.createForClass(Uplink);
