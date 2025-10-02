import { AuthService } from "./auth.service";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    getProfile(req: any): Promise<{
        user: any;
        organizations: string[];
    }>;
    getAllUsers(): Promise<{
        message: string;
    }>;
    getUserCount(): Promise<{
        totalUsers: number;
        error?: undefined;
    } | {
        totalUsers: number;
        error: string;
    }>;
    getKeycloakUsers(limit?: string, offset?: string): Promise<any>;
    assignUserToOrganizations(userId: string, organizationIds: string[]): Promise<{
        success: boolean;
        user: import("../database/schemas").UserDocument;
    }>;
    checkOrganizationAccess(req: any, organizationId: string): Promise<{
        hasAccess: boolean;
    }>;
}
