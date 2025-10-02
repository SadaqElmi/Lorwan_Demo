import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsObject,
} from "class-validator";
import { Transform } from "class-transformer";

export class CreateDeviceDto {
  @IsString()
  device_id: string;

  @IsString()
  application_id: string;

  @IsOptional()
  @IsObject()
  payload_template?: any;
}

export class GetUplinksDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  limit?: number = 50;

  @IsOptional()
  @IsString()
  device_id?: string;

  @IsOptional()
  @IsString()
  application_id?: string;

  @IsOptional()
  @IsString()
  format?: string;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;
}

export class GetDeviceUplinksDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  limit?: number = 20;
}
