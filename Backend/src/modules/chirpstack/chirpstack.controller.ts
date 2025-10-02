import { Body, Controller, Post } from "@nestjs/common";
import { ChirpstackService } from "./chirpstack.service";

class CreateTenantBody {
  name: string;
  meta?: any;
}

class CreateApplicationBody {
  name: string;
  tenant_id: string;
  meta?: any;
}

class CreateDeviceBody {
  name: string;
  dev_eui: string;
  application_id: string;
  meta?: any;
}

@Controller("chirpstack")
export class ChirpstackController {
  constructor(private readonly chirpstackService: ChirpstackService) {}

  @Post("tenants")
  async createTenant(@Body() body: CreateTenantBody) {
    const { name, meta } = body;
    const result = await this.chirpstackService.createTenant(name, meta);
    return { success: true, tenant_id: result.id };
  }

  @Post("applications")
  async createApplication(@Body() body: CreateApplicationBody) {
    const { name, tenant_id, meta } = body;
    const result = await this.chirpstackService.createApplication(
      name,
      tenant_id,
      meta,
    );
    return { success: true, application_id: result.id };
  }

  @Post("devices")
  async createDevice(@Body() body: CreateDeviceBody) {
    const { name, dev_eui, application_id, meta } = body;
    const result = await this.chirpstackService.createDevice(
      name,
      dev_eui,
      application_id,
      meta,
    );
    return { success: true, device_id: result.id };
  }
}
