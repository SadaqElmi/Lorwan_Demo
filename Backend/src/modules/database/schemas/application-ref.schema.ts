import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ApplicationRefDocument = ApplicationRef & Document;

@Schema({ timestamps: true })
export class ApplicationRef {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  tenant_chirpstack_id: string;

  @Prop({ required: true, unique: true })
  chirpstack_id: string;

  @Prop({ type: Object })
  meta?: any;
}

export const ApplicationRefSchema =
  SchemaFactory.createForClass(ApplicationRef);
