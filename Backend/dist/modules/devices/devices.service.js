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
exports.DevicesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const uplink_schema_1 = require("../database/schemas/uplink.schema");
let DevicesService = class DevicesService {
    constructor(uplinkModel) {
        this.uplinkModel = uplinkModel;
    }
    async findAll() {
        const devices = await this.uplinkModel
            .aggregate([
            {
                $group: {
                    _id: "$device_id",
                    total_uplinks: { $sum: 1 },
                    last_seen: { $max: "$ts" },
                    first_seen: { $min: "$ts" },
                    applications: { $addToSet: "$application_id" },
                    payload_formats: { $addToSet: "$payload._format" },
                },
            },
            {
                $match: { _id: { $ne: null } },
            },
            {
                $sort: { last_seen: -1 },
            },
        ])
            .exec();
        return {
            success: true,
            devices: devices.map((device) => ({
                device_id: device._id,
                total_uplinks: device.total_uplinks,
                last_seen: device.last_seen,
                first_seen: device.first_seen,
                applications: device.applications.filter((app) => app),
                payload_formats: device.payload_formats.filter((format) => format),
            })),
        };
    }
    async create(createDeviceDto) {
        const { device_id, application_id, payload_template } = createDeviceDto;
        const testPayload = {
            temperature: Math.floor(Math.random() * 30) + 10,
            humidity: Math.floor(Math.random() * 40) + 40,
            battery: Math.floor(Math.random() * 30) + 70,
            timestamp: new Date().toISOString(),
            ...payload_template,
        };
        const testUplink = {
            topic: `application/${application_id}/device/${device_id}/event/up`,
            payload: {
                decoded_payload: testPayload,
                metadata: {
                    device_id: device_id,
                    application_id: application_id,
                    f_port: 1,
                    f_cnt: 1,
                },
                _format: "json",
                _parsed_at: new Date(),
                _topic: `application/${application_id}/device/${device_id}/event/up`,
            },
            ts: new Date(),
            device_id: device_id,
            application_id: application_id,
        };
        const result = await this.uplinkModel.create(testUplink);
        return {
            success: true,
            message: `Test device ${device_id} created successfully`,
            device: {
                device_id,
                application_id,
                test_uplink_id: result._id,
            },
        };
    }
};
exports.DevicesService = DevicesService;
exports.DevicesService = DevicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(uplink_schema_1.Uplink.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DevicesService);
//# sourceMappingURL=devices.service.js.map