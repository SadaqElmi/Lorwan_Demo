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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("./auth.service");
const nest_keycloak_connect_1 = require("nest-keycloak-connect");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async getProfile(req) {
        return {
            user: req.user,
            organizations: await this.authService.getUserOrganizations(req.user._id),
        };
    }
    async getAllUsers() {
        return {
            message: "This endpoint would return all users for admin management",
        };
    }
    async getUserCount() {
        try {
            const count = await this.authService.getKeycloakUserCount();
            return { totalUsers: count };
        }
        catch (error) {
            console.error("Error fetching user count:", error);
            return { totalUsers: 0, error: "Failed to fetch user count" };
        }
    }
    async getKeycloakUsers(limit, offset) {
        try {
            const l = limit ? parseInt(limit, 10) : 100;
            const o = offset ? parseInt(offset, 10) : 0;
            const result = await this.authService.getKeycloakUsers(l, o);
            return result;
        }
        catch (error) {
            console.error("Error fetching Keycloak users:", error);
            return { users: [], totalCount: 0, error: "Failed to fetch users" };
        }
    }
    async assignUserToOrganizations(userId, organizationIds) {
        const user = await this.authService.updateUserOrganizations(userId, organizationIds);
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        return { success: true, user };
    }
    async checkOrganizationAccess(req, organizationId) {
        const hasAccess = await this.authService.hasAccessToOrganization(req.user._id, organizationId);
        return { hasAccess };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)("profile"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)("users"),
    (0, nest_keycloak_connect_1.Roles)({ roles: ["admin"] }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)("users/count"),
    (0, nest_keycloak_connect_1.Roles)({ roles: ["admin"] }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getUserCount", null);
__decorate([
    (0, common_1.Get)("users/keycloak"),
    (0, nest_keycloak_connect_1.Roles)({ roles: ["admin"] }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __param(0, (0, common_1.Query)("limit")),
    __param(1, (0, common_1.Query)("offset")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getKeycloakUsers", null);
__decorate([
    (0, common_1.Post)("users/:userId/organizations"),
    (0, nest_keycloak_connect_1.Roles)({ roles: ["admin"] }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __param(0, (0, common_1.Param)("userId")),
    __param(1, (0, common_1.Body)("organizationIds")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "assignUserToOrganizations", null);
__decorate([
    (0, common_1.Get)("check-access/:organizationId"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)("organizationId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkOrganizationAccess", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)("api/auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map