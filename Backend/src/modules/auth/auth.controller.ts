import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { Roles } from "nest-keycloak-connect";

@Controller("api/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("profile")
  @UseGuards(AuthGuard("jwt"))
  async getProfile(@Request() req) {
    return {
      user: req.user,
      organizations: await this.authService.getUserOrganizations(req.user._id),
    };
  }

  @Get("users")
  @Roles({ roles: ["admin"] })
  @UseGuards(AuthGuard("jwt"))
  async getAllUsers() {
    // Only admins can view all users
    return {
      message: "This endpoint would return all users for admin management",
    };
  }

  @Get("users/count")
  @Roles({ roles: ["admin"] })
  @UseGuards(AuthGuard("jwt"))
  async getUserCount() {
    try {
      const count = await this.authService.getKeycloakUserCount();
      return { totalUsers: count };
    } catch (error) {
      console.error("Error fetching user count:", error);
      return { totalUsers: 0, error: "Failed to fetch user count" };
    }
  }

  @Get("users/keycloak")
  @Roles({ roles: ["admin"] })
  @UseGuards(AuthGuard("jwt"))
  async getKeycloakUsers(
    @Query("limit") limit?: string,
    @Query("offset") offset?: string
  ) {
    try {
      const l = limit ? parseInt(limit, 10) : 100;
      const o = offset ? parseInt(offset, 10) : 0;

      const result = await this.authService.getKeycloakUsers(l, o);
      return result;
    } catch (error) {
      console.error("Error fetching Keycloak users:", error);
      return { users: [], totalCount: 0, error: "Failed to fetch users" };
    }
  }

  @Post("users/:userId/organizations")
  @Roles({ roles: ["admin"] })
  @UseGuards(AuthGuard("jwt"))
  async assignUserToOrganizations(
    @Param("userId") userId: string,
    @Body("organizationIds") organizationIds: string[]
  ) {
    const user = await this.authService.updateUserOrganizations(
      userId,
      organizationIds
    );
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return { success: true, user };
  }

  @Get("check-access/:organizationId")
  @UseGuards(AuthGuard("jwt"))
  async checkOrganizationAccess(
    @Request() req,
    @Param("organizationId") organizationId: string
  ) {
    const hasAccess = await this.authService.hasAccessToOrganization(
      req.user._id,
      organizationId
    );
    return { hasAccess };
  }
}
