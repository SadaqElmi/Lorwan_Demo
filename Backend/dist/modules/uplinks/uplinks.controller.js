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
exports.UplinksController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const uplinks_service_1 = require("./uplinks.service");
const uplink_dto_1 = require("../../common/dto/uplink.dto");
let UplinksController = class UplinksController {
    constructor(uplinksService) {
        this.uplinksService = uplinksService;
    }
    async findAll(query) {
        return this.uplinksService.findAll(query);
    }
    async findByDevice(deviceId, query) {
        return this.uplinksService.findByDevice(deviceId, query.limit);
    }
    async getStats() {
        return this.uplinksService.getStats();
    }
    async getRecent(limit) {
        const l = limit ? parseInt(limit, 10) : 10;
        return this.uplinksService.findRecent(l);
    }
    async getApplications() {
        return this.uplinksService.getApplications();
    }
    async getDevices(applicationId) {
        return this.uplinksService.getDevices(applicationId);
    }
    async simulate(body) {
        return this.uplinksService.simulateUplink(body);
    }
};
exports.UplinksController = UplinksController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [uplink_dto_1.GetUplinksDto]),
    __metadata("design:returntype", Promise)
], UplinksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("device/:deviceId"),
    __param(0, (0, common_1.Param)("deviceId")),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, uplink_dto_1.GetDeviceUplinksDto]),
    __metadata("design:returntype", Promise)
], UplinksController.prototype, "findByDevice", null);
__decorate([
    (0, common_1.Get)("stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UplinksController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)("recent"),
    __param(0, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UplinksController.prototype, "getRecent", null);
__decorate([
    (0, common_1.Get)("applications"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UplinksController.prototype, "getApplications", null);
__decorate([
    (0, common_1.Get)("devices"),
    __param(0, (0, common_1.Query)("applicationId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UplinksController.prototype, "getDevices", null);
__decorate([
    (0, common_1.Post)("simulate"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UplinksController.prototype, "simulate", null);
exports.UplinksController = UplinksController = __decorate([
    (0, common_1.Controller)("uplinks"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [uplinks_service_1.UplinksService])
], UplinksController);
//# sourceMappingURL=uplinks.controller.js.map