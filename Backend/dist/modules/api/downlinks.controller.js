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
exports.DownlinksController = void 0;
const common_1 = require("@nestjs/common");
const mqtt_service_1 = require("../mqtt/mqtt.service");
const downlink_dto_1 = require("../../common/dto/downlink.dto");
let DownlinksController = class DownlinksController {
    constructor(mqttService) {
        this.mqttService = mqttService;
    }
    async list(query) {
        return this.mqttService.getDownlinks({
            limit: query.limit,
            device_eui: query.device_eui,
            application_id: query.application_id,
            status: query.status,
        });
    }
    async send(body) {
        try {
            const base64Data = this.mqttService.hexToBase64(body.payload);
            const downlinkId = await this.mqttService.sendDownlink(body.application_id, body.device_eui, body.f_port, base64Data, body.confirmed || false);
            return {
                success: true,
                downlink_id: downlinkId,
                message: `Downlink sent to device ${body.device_eui}`,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to send downlink: ${error.message}`);
        }
    }
    async sendRaw(body) {
        try {
            const downlinkId = await this.mqttService.sendDownlink(body.application_id, body.device_eui, body.f_port, body.data, body.confirmed || false);
            return {
                success: true,
                downlink_id: downlinkId,
                message: `Raw downlink sent to device ${body.device_eui}`,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to send raw downlink: ${error.message}`);
        }
    }
};
exports.DownlinksController = DownlinksController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [downlink_dto_1.GetDownlinksDto]),
    __metadata("design:returntype", Promise)
], DownlinksController.prototype, "list", null);
__decorate([
    (0, common_1.Post)("send"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [downlink_dto_1.SendDownlinkDto]),
    __metadata("design:returntype", Promise)
], DownlinksController.prototype, "send", null);
__decorate([
    (0, common_1.Post)("send-raw"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DownlinksController.prototype, "sendRaw", null);
exports.DownlinksController = DownlinksController = __decorate([
    (0, common_1.Controller)("api/downlinks"),
    __metadata("design:paramtypes", [mqtt_service_1.MqttService])
], DownlinksController);
//# sourceMappingURL=downlinks.controller.js.map