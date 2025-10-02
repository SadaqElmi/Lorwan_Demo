import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthService } from "../auth.service";

@Injectable()
export class OrganizationAccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    // Check if user is admin (admins have access to everything)
    if (await this.authService.isAdmin(user._id)) {
      return true;
    }

    // Extract organization ID from request
    let organizationId: string | undefined;

    // Check query parameters
    if (request.query?.organizationId) {
      organizationId = request.query.organizationId;
    }

    // Check body parameters
    if (request.body?.organizationId) {
      organizationId = request.body.organizationId;
    }

    // Check URL parameters
    if (request.params?.organizationId) {
      organizationId = request.params.organizationId;
    }

    // For tenant endpoints, the organization ID might be in different parameter names
    if (request.params?.id && request.url.includes("/organizations/")) {
      organizationId = request.params.id;
    }

    if (!organizationId) {
      // If no organization ID is specified, allow access (user will see only their organizations)
      return true;
    }

    // Check if user has access to this organization
    const hasAccess = await this.authService.hasAccessToOrganization(
      user._id,
      organizationId
    );

    if (!hasAccess) {
      throw new ForbiddenException(
        "You do not have access to this organization"
      );
    }

    return true;
  }
}
