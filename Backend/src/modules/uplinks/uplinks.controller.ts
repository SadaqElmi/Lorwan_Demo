import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UplinksService } from "./uplinks.service";
import {
  GetUplinksDto,
  GetDeviceUplinksDto,
} from "../../common/dto/uplink.dto";

@Controller("uplinks")
@UseGuards(AuthGuard("jwt"))
export class UplinksController {
  constructor(private readonly uplinksService: UplinksService) {}

  @Get()
  async findAll(@Query() query: GetUplinksDto) {
    return this.uplinksService.findAll(query);
  }

  @Get("device/:deviceId")
  async findByDevice(
    @Param("deviceId") deviceId: string,
    @Query() query: GetDeviceUplinksDto
  ) {
    return this.uplinksService.findByDevice(deviceId, query.limit);
  }

  @Get("stats")
  async getStats() {
    return this.uplinksService.getStats();
  }

  @Get("recent")
  async getRecent(@Query("limit") limit?: string) {
    const l = limit ? parseInt(limit as string, 10) : 10;
    return this.uplinksService.findRecent(l);
  }

  @Get("applications")
  async getApplications() {
    return this.uplinksService.getApplications();
  }

  @Get("devices")
  async getDevices(@Query("applicationId") applicationId?: string) {
    return this.uplinksService.getDevices(applicationId);
  }

  @Post("simulate")
  async simulate(
    @Body()
    body: {
      device_id: string;
      application_id: string;
      payload?: any;
      f_port?: number;
    }
  ) {
    return this.uplinksService.simulateUplink(body);
  }
}
