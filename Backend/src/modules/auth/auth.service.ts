import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { User, UserDocument } from "../database/schemas/user.schema";
import { JwtPayload } from "./strategies/jwt.strategy";

@Injectable()
export class AuthService {
  private keycloakUrl = process.env.KEYCLOAK_URL || "http://localhost:9090";
  private keycloakRealm = process.env.KEYCLOAK_REALM || "lorawan";
  private keycloakClientId =
    process.env.KEYCLOAK_CLIENT_ID || "lorawan-backend";
  private keycloakClientSecret = process.env.KEYCLOAK_CLIENT_SECRET || "";

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private httpService: HttpService
  ) {}

  async validateUser(payload: JwtPayload): Promise<UserDocument> {
    const {
      sub,
      preferred_username,
      email,
      given_name,
      family_name,
      realm_access,
    } = payload;

    // Extract roles from Keycloak token
    const roles = realm_access?.roles || [];

    // Find existing user or create new one
    let user = await this.userModel.findOne({ keycloak_id: sub });

    if (!user) {
      // Create new user
      user = await this.userModel.create({
        keycloak_id: sub,
        username: preferred_username,
        email: email,
        first_name: given_name,
        last_name: family_name,
        roles: roles,
        organization_ids: [], // Will be assigned by admin
        is_active: true,
      });
    } else {
      // Update user info from token
      user.username = preferred_username;
      user.email = email;
      user.first_name = given_name;
      user.last_name = family_name;
      user.roles = roles;
      await user.save();
    }

    return user;
  }

  async findUserById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }

  async findUserByKeycloakId(keycloakId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ keycloak_id: keycloakId });
  }

  async updateUserOrganizations(
    userId: string,
    organizationIds: string[]
  ): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { organization_ids: organizationIds },
      { new: true }
    );
  }

  async getUserOrganizations(userId: string): Promise<string[]> {
    const user = await this.userModel.findById(userId);
    return user?.organization_ids || [];
  }

  async hasAccessToOrganization(
    userId: string,
    organizationId: string
  ): Promise<boolean> {
    const user = await this.userModel.findById(userId);
    if (!user) return false;

    // Admins have access to all organizations
    if (user.roles.includes("admin")) return true;

    // Check if user has explicit access to this organization
    return user.organization_ids.includes(organizationId);
  }

  async isAdmin(userId: string): Promise<boolean> {
    const user = await this.userModel.findById(userId);
    return user?.roles.includes("admin") || false;
  }

  generateToken(payload: any): string {
    return this.jwtService.sign(payload);
  }

  // Get access token for Keycloak Admin API
  private async getKeycloakAdminToken(): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.keycloakUrl}/realms/${this.keycloakRealm}/protocol/openid-connect/token`,
          new URLSearchParams({
            grant_type: "client_credentials",
            client_id: this.keycloakClientId,
            client_secret: this.keycloakClientSecret,
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
      );
      return (response.data as any).access_token;
    } catch (error) {
      console.error("Failed to get Keycloak admin token:", error);
      throw new Error("Failed to authenticate with Keycloak");
    }
  }

  // Fetch users directly from Keycloak
  async getKeycloakUsers(
    limit: number = 100,
    offset: number = 0
  ): Promise<any> {
    try {
      const adminToken = await this.getKeycloakAdminToken();

      const response = await firstValueFrom(
        this.httpService.get(
          `${this.keycloakUrl}/admin/realms/${this.keycloakRealm}/users`,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
            params: {
              max: limit,
              first: offset,
            },
          }
        )
      );

      return {
        users: response.data as any,
        totalCount: (response.data as any).length,
      };
    } catch (error) {
      console.error("Failed to fetch users from Keycloak:", error);
      throw new Error("Failed to fetch users from Keycloak");
    }
  }

  // Get total user count from Keycloak
  async getKeycloakUserCount(): Promise<number> {
    try {
      const adminToken = await this.getKeycloakAdminToken();

      const response = await firstValueFrom(
        this.httpService.get(
          `${this.keycloakUrl}/admin/realms/${this.keycloakRealm}/users/count`,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        )
      );

      return response.data as any;
    } catch (error) {
      console.error("Failed to get user count from Keycloak:", error);
      // Fallback to local database count
      return this.userModel.countDocuments();
    }
  }
}
