"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationAccessGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const auth_service_1 = require("../auth.service");
let OrganizationAccessGuard = class OrganizationAccessGuard {
    constructor(reflector, authService) {
        this.reflector = reflector;
        this.authService = authService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            return false;
        }
        if (await this.authService.isAdmin(user._id)) {
            return true;
        }
        let organizationId;
        if (request.query?.organizationId) {
            organizationId = request.query.organizationId;
        }
        if (request.body?.organizationId) {
            organizationId = request.body.organizationId;
        }
        if (request.params?.organizationId) {
            organizationId = request.params.organizationId;
        }
        if (request.params?.id && request.url.includes("/organizations/")) {
            organizationId = request.params.id;
        }
        if (!organizationId) {
            return true;
        }
        const hasAccess = await this.authService.hasAccessToOrganization(user._id, organizationId);
        if (!hasAccess) {
            throw new common_1.ForbiddenException("You do not have access to this organization");
        }
        return true;
    }
};
exports.OrganizationAccessGuard = OrganizationAccessGuard;
exports.OrganizationAccessGuard = OrganizationAccessGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        auth_service_1.AuthService])
], OrganizationAccessGuard);
//# sourceMappingURL=organization-access.guard.js.map