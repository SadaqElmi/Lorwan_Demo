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
exports.DevicesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const chirpstack_service_1 = require("../chirpstack/chirpstack.service");
const auth_service_1 = require("../auth/auth.service");
let DevicesController = class DevicesController {
    constructor(chirp, authService) {
        this.chirp = chirp;
        this.authService = authService;
    }
    async list(applicationId, limit, offset, search) {
        const l = limit ? parseInt(limit, 10) : undefined;
        const o = offset ? parseInt(offset, 10) : undefined;
        return this.chirp.listDevices(applicationId, l, o, search);
    }
    async listProfiles(tenantId, limit, offset, search) {
        const l = limit ? parseInt(limit, 10) : undefined;
        const o = offset ? parseInt(offset, 10) : undefined;
        return this.chirp.listDeviceProfiles(tenantId, l, o, search);
    }
    async getProfile(id) {
        return this.chirp.getDeviceProfile(id);
    }
    async create(body) {
        const res = await this.chirp.createDevice(body.name, body.devEui, body.applicationId, {
            description: body.description,
            deviceProfileId: body.deviceProfileId,
            ...body.meta,
        });
        return { id: res.id };
    }
    async update(devEui, body) {
        try {
            console.log("🔧 Updating device:", { devEui, body });
            if (!/^[0-9a-fA-F]{16}$/.test(devEui)) {
                throw new Error(`Invalid DevEUI format: ${devEui}. DevEUI must be 16 hexadecimal characters.`);
            }
            if (!body.name && !body.description && !body.deviceProfileId) {
                throw new Error("At least one field (name, description, or deviceProfileId) must be provided for update.");
            }
            await this.chirp.updateDevice(devEui, body);
            console.log("✅ Device updated successfully:", devEui);
            return { success: true };
        }
        catch (error) {
            console.error("❌ Error updating device:", error);
            throw error;
        }
    }
    async remove(devEui) {
        await this.chirp.deleteDevice(devEui);
        return { success: true };
    }
    async createProfile(body) {
        const res = await this.chirp.createDeviceProfile(body.name, body.tenantId, body.description, body.region);
        return { id: res.id };
    }
    async updateProfile(id, body) {
        await this.chirp.updateDeviceProfile(id, body);
        return { success: true };
    }
    async removeProfile(id) {
        await this.chirp.deleteDeviceProfile(id);
        return { success: true };
    }
};
exports.DevicesController = DevicesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("applicationId")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Query)("offset")),
    __param(3, (0, common_1.Query)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)("profiles"),
    __param(0, (0, common_1.Query)("tenantId")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Query)("offset")),
    __param(3, (0, common_1.Query)("search")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "listProfiles", null);
__decorate([
    (0, common_1.Get)("profiles/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":devEui"),
    __param(0, (0, common_1.Param)("devEui")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":devEui"),
    __param(0, (0, common_1.Param)("devEui")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)("profiles"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "createProfile", null);
__decorate([
    (0, common_1.Put)("profiles/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Delete)("profiles/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "removeProfile", null);
exports.DevicesController = DevicesController = __decorate([
    (0, common_1.Controller)("api/devices"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [chirpstack_service_1.ChirpstackService,
        auth_service_1.AuthService])
], DevicesController);
//# sourceMappingURL=devices.controller.js.map