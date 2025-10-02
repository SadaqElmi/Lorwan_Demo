import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsBase64,
  Min,
  Max,
} from "class-validator";
import { Transform } from "class-transformer";

export class CreateDownlinkDto {
  @IsString()
  device_eui: string;

  @IsString()
  application_id: string;

  @IsNumber()
  @Min(1)
  @Max(223)
  f_port: number;

  @IsBase64()
  data: string; // base64 encoded payload

  @IsOptional()
  @IsBoolean()
  confirmed?: boolean = false;

  @IsOptional()
  metadata?: any;
}

export class SendDownlinkDto {
  @IsString()
  device_eui: string;

  @IsString()
  application_id: string;

  @IsNumber()
  @Min(1)
  @Max(223)
  f_port: number;

  @IsString()
  payload: string; // hex string that will be converted to base64

  @IsOptional()
  @IsBoolean()
  confirmed?: boolean = false;
}

export class GetDownlinksDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  limit?: number = 50;

  @IsOptional()
  @IsString()
  device_eui?: string;

  @IsOptional()
  @IsString()
  application_id?: string;

  @IsOptional()
  @IsString()
  status?: string; // pending, sent, acknowledged, failed
}
