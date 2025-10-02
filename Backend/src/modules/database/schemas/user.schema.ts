import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  keycloak_id: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  first_name?: string;

  @Prop()
  last_name?: string;

  @Prop({ type: [String], default: [] })
  roles: string[];

  @Prop({ type: [String], default: [] })
  organization_ids: string[]; // ChirpStack tenant IDs this user has access to

  @Prop({ default: true })
  is_active: boolean;

  @Prop({ type: Object })
  metadata?: any;
}

export const UserSchema = SchemaFactory.createForClass(User);
