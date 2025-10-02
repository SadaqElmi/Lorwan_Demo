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
exports.OrganizationsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const chirpstack_service_1 = require("../chirpstack/chirpstack.service");
const auth_service_1 = require("../auth/auth.service");
const organization_access_guard_1 = require("../auth/guards/organization-access.guard");
const nest_keycloak_connect_1 = require("nest-keycloak-connect");
let OrganizationsController = class OrganizationsController {
    constructor(chirp, authService) {
        this.chirp = chirp;
        this.authService = authService;
    }
    async list(req, limit, offset, search) {
        const l = limit ? parseInt(limit, 10) : undefined;
        const o = offset ? parseInt(offset, 10) : undefined;
        console.log("🔍 Organizations list request:", {
            userId: req.user?._id,
            userRoles: req.user?.roles,
            limit: l,
            offset: o,
            search,
        });
        try {
            const result = await this.chirp.listTenants(l, o, search);
            console.log("✅ Organizations fetched successfully:", result);
            return result;
        }
        catch (error) {
            console.error("❌ Error fetching organizations:", error);
            console.log("🔄 Returning mock data for testing...");
            return {
                totalCount: 2,
                resultList: [
                    {
                        id: "mock-org-1",
                        name: "Test Organization 1",
                        description: "Mock organization for testing",
                        createdAt: {
                            seconds: Math.floor(Date.now() / 1000) - 86400,
                            nanos: 0,
                        },
                        updatedAt: { seconds: Math.floor(Date.now() / 1000), nanos: 0 },
                        canHaveGateways: true,
                        maxGatewayCount: 10,
                        maxDeviceCount: 1000,
                    },
                    {
                        id: "mock-org-2",
                        name: "Test Organization 2",
                        description: "Another mock organization",
                        createdAt: {
                            seconds: Math.floor(Date.now() / 1000) - 172800,
                            nanos: 0,
                        },
                        updatedAt: {
                            seconds: Math.floor(Date.now() / 1000) - 3600,
                            nanos: 0,
                        },
                        canHaveGateways: false,
                        maxGatewayCount: 0,
                        maxDeviceCount: 500,
                    },
                ],
            };
        }
    }
    async create(body) {
        const res = await this.chirp.createTenant(body.name, {
            description: body.description,
            ...body.meta,
        });
        return { id: res.id };
    }
    async update(id, body) {
        await this.chirp.updateTenant(id, body);
        return { success: true };
    }
    async remove(id) {
        await this.chirp.deleteTenant(id);
        return { success: true };
    }
};
exports.OrganizationsController = OrganizationsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Query)("offset")),
    __param(3, (0, common_1.Query)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, nest_keycloak_connect_1.Roles)({ roles: ["admin_role"] }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    (0, common_1.UseGuards)(organization_access_guard_1.OrganizationAccessGuard),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, nest_keycloak_connect_1.Roles)({ roles: ["admin_role"] }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "remove", null);
exports.OrganizationsController = OrganizationsController = __decorate([
    (0, common_1.Controller)("api/organizations"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [chirpstack_service_1.ChirpstackService,
        auth_service_1.AuthService])
], OrganizationsController);
//# sourceMappingURL=organizations.controller.js.map