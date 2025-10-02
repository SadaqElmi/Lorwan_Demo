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
  Request,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ChirpstackService } from "../chirpstack/chirpstack.service";
import { AuthService } from "../auth/auth.service";
import { OrganizationAccessGuard } from "../auth/guards/organization-access.guard";

@Controller("api/applications")
@UseGuards(AuthGuard("jwt"))
export class ApplicationsController {
  constructor(
    private readonly chirp: ChirpstackService,
    private readonly authService: AuthService
  ) {}

  @Get()
  async list(
    @Query("organizationId") organizationId: string,
    @Query("limit") limit?: string,
    @Query("offset") offset?: string,
    @Query("search") search?: string
  ) {
    const l = limit ? parseInt(limit as string, 10) : undefined;
    const o = offset ? parseInt(offset as string, 10) : undefined;
    return this.chirp.listApplications(organizationId, l, o, search);
  }

  @Post()
  async create(
    @Body()
    body: {
      name: string;
      organizationId: string;
      description?: string;
      meta?: any;
    }
  ) {
    const res = await this.chirp.createApplication(
      body.name,
      body.organizationId,
      { description: body.description, ...body.meta }
    );
    return { id: res.id };
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() body: { name?: string; description?: string }
  ) {
    await this.chirp.updateApplication(id, body);
    return { success: true };
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    await this.chirp.deleteApplication(id);
    return { success: true };
  }
}
