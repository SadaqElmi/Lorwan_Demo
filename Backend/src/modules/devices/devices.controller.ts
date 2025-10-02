import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { DevicesService } from "./devices.service";
import { CreateDeviceDto } from "../../common/dto/uplink.dto";

@Controller("devices")
@UseGuards(AuthGuard("jwt"))
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Get()
  async findAll() {
    return this.devicesService.findAll();
  }

  @Post()
  async create(@Body() createDeviceDto: CreateDeviceDto) {
    return this.devicesService.create(createDeviceDto);
  }
}
