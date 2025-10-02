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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt_1 = require("@nestjs/jwt");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const user_schema_1 = require("../database/schemas/user.schema");
let AuthService = class AuthService {
    constructor(userModel, jwtService, httpService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.httpService = httpService;
        this.keycloakUrl = process.env.KEYCLOAK_URL || "http://localhost:9090";
        this.keycloakRealm = process.env.KEYCLOAK_REALM || "lorawan";
        this.keycloakClientId = process.env.KEYCLOAK_CLIENT_ID || "lorawan-backend";
        this.keycloakClientSecret = process.env.KEYCLOAK_CLIENT_SECRET || "";
    }
    async validateUser(payload) {
        const { sub, preferred_username, email, given_name, family_name, realm_access, } = payload;
        const roles = realm_access?.roles || [];
        let user = await this.userModel.findOne({ keycloak_id: sub });
        if (!user) {
            user = await this.userModel.create({
                keycloak_id: sub,
                username: preferred_username,
                email: email,
                first_name: given_name,
                last_name: family_name,
                roles: roles,
                organization_ids: [],
                is_active: true,
            });
        }
        else {
            user.username = preferred_username;
            user.email = email;
            user.first_name = given_name;
            user.last_name = family_name;
            user.roles = roles;
            await user.save();
        }
        return user;
    }
    async findUserById(id) {
        return this.userModel.findById(id);
    }
    async findUserByKeycloakId(keycloakId) {
        return this.userModel.findOne({ keycloak_id: keycloakId });
    }
    async updateUserOrganizations(userId, organizationIds) {
        return this.userModel.findByIdAndUpdate(userId, { organization_ids: organizationIds }, { new: true });
    }
    async getUserOrganizations(userId) {
        const user = await this.userModel.findById(userId);
        return user?.organization_ids || [];
    }
    async hasAccessToOrganization(userId, organizationId) {
        const user = await this.userModel.findById(userId);
        if (!user)
            return false;
        if (user.roles.includes("admin"))
            return true;
        return user.organization_ids.includes(organizationId);
    }
    async isAdmin(userId) {
        const user = await this.userModel.findById(userId);
        return user?.roles.includes("admin") || false;
    }
    generateToken(payload) {
        return this.jwtService.sign(payload);
    }
    async getKeycloakAdminToken() {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.keycloakUrl}/realms/${this.keycloakRealm}/protocol/openid-connect/token`, new URLSearchParams({
                grant_type: "client_credentials",
                client_id: this.keycloakClientId,
                client_secret: this.keycloakClientSecret,
            }), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }));
            return response.data.access_token;
        }
        catch (error) {
            console.error("Failed to get Keycloak admin token:", error);
            throw new Error("Failed to authenticate with Keycloak");
        }
    }
    async getKeycloakUsers(limit = 100, offset = 0) {
        try {
            const adminToken = await this.getKeycloakAdminToken();
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.keycloakUrl}/admin/realms/${this.keycloakRealm}/users`, {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
                params: {
                    max: limit,
                    first: offset,
                },
            }));
            return {
                users: response.data,
                totalCount: response.data.length,
            };
        }
        catch (error) {
            console.error("Failed to fetch users from Keycloak:", error);
            throw new Error("Failed to fetch users from Keycloak");
        }
    }
    async getKeycloakUserCount() {
        try {
            const adminToken = await this.getKeycloakAdminToken();
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.keycloakUrl}/admin/realms/${this.keycloakRealm}/users/count`, {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
            }));
            return response.data;
        }
        catch (error) {
            console.error("Failed to get user count from Keycloak:", error);
            return this.userModel.countDocuments();
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        axios_1.HttpService])
], AuthService);
//# sourceMappingURL=auth.service.js.map