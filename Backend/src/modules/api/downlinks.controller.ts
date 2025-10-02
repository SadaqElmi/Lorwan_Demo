import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  BadRequestException,
} from "@nestjs/common";
import { MqttService } from "../mqtt/mqtt.service";
import {
  SendDownlinkDto,
  GetDownlinksDto,
} from "../../common/dto/downlink.dto";

@Controller("api/downlinks")
export class DownlinksController {
  constructor(private readonly mqttService: MqttService) {}

  @Get()
  async list(@Query() query: GetDownlinksDto) {
    return this.mqttService.getDownlinks({
      limit: query.limit,
      device_eui: query.device_eui,
      application_id: query.application_id,
      status: query.status,
    });
  }

  @Post("send")
  async send(@Body() body: SendDownlinkDto) {
    try {
      // Convert hex payload to base64 for ChirpStack
      const base64Data = this.mqttService.hexToBase64(body.payload);

      const downlinkId = await this.mqttService.sendDownlink(
        body.application_id,
        body.device_eui,
        body.f_port,
        base64Data,
        body.confirmed || false
      );

      return {
        success: true,
        downlink_id: downlinkId,
        message: `Downlink sent to device ${body.device_eui}`,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to send downlink: ${error.message}`
      );
    }
  }

  @Post("send-raw")
  async sendRaw(
    @Body()
    body: {
      device_eui: string;
      application_id: string;
      f_port: number;
      data: string; // base64 encoded
      confirmed?: boolean;
    }
  ) {
    try {
      const downlinkId = await this.mqttService.sendDownlink(
        body.application_id,
        body.device_eui,
        body.f_port,
        body.data, // already base64
        body.confirmed || false
      );

      return {
        success: true,
        downlink_id: downlinkId,
        message: `Raw downlink sent to device ${body.device_eui}`,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to send raw downlink: ${error.message}`
      );
    }
  }
}
