import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ChirpstackService } from "../chirpstack/chirpstack.service";
import { AuthService } from "../auth/auth.service";
import { OrganizationAccessGuard } from "../auth/guards/organization-access.guard";

@Controller("api/devices")
@UseGuards(AuthGuard("jwt"))
export class DevicesController {
  constructor(
    private readonly chirp: ChirpstackService,
    private readonly authService: AuthService
  ) {}

  @Get()
  async list(
    @Query("applicationId") applicationId: string,
    @Query("limit") limit?: string,
    @Query("offset") offset?: string,
    @Query("search") search?: string
  ) {
    const l = limit ? parseInt(limit as string, 10) : undefined;
    const o = offset ? parseInt(offset as string, 10) : undefined;
    return this.chirp.listDevices(applicationId, l, o, search);
  }

  @Get("profiles")
  async listProfiles(
    @Query("tenantId") tenantId: string,
    @Query("limit") limit?: string,
    @Query("offset") offset?: string,
    @Query("search") search?: string
  ) {
    const l = limit ? parseInt(limit as string, 10) : undefined;
    const o = offset ? parseInt(offset as string, 10) : undefined;
    return this.chirp.listDeviceProfiles(tenantId, l, o, search);
  }

  @Get("profiles/:id")
  async getProfile(@Param("id") id: string) {
    return this.chirp.getDeviceProfile(id);
  }

  @Post()
  async create(
    @Body()
    body: {
      name: string;
      devEui: string;
      applicationId: string;
      description?: string;
      deviceProfileId?: string;
      meta?: any;
    }
  ) {
    const res = await this.chirp.createDevice(
      body.name,
      body.devEui,
      body.applicationId,
      {
        description: body.description,
        deviceProfileId: body.deviceProfileId,
        ...body.meta,
      }
    );
    return { id: res.id };
  }

  @Put(":devEui")
  async update(
    @Param("devEui") devEui: string,
    @Body()
    body: { name?: string; description?: string; deviceProfileId?: string }
  ) {
    await this.chirp.updateDevice(devEui, body);
    return { success: true };
  }

  @Delete(":devEui")
  async remove(@Param("devEui") devEui: string) {
    await this.chirp.deleteDevice(devEui);
    return { success: true };
  }

  // Device Profile Management
  @Post("profiles")
  async createProfile(
    @Body()
    body: {
      name: string;
      tenantId: string;
      description?: string;
      region?: string;
    }
  ) {
    const res = await this.chirp.createDeviceProfile(
      body.name,
      body.tenantId,
      body.description,
      body.region
    );
    return { id: res.id };
  }

  @Put("profiles/:id")
  async updateProfile(
    @Param("id") id: string,
    @Body()
    body: { name?: string; description?: string; region?: string }
  ) {
    await this.chirp.updateDeviceProfile(id, body);
    return { success: true };
  }

  @Delete("profiles/:id")
  async removeProfile(@Param("id") id: string) {
    await this.chirp.deleteDeviceProfile(id);
    return { success: true };
  }
}
