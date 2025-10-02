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
exports.UplinksService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const uplink_schema_1 = require("../database/schemas/uplink.schema");
let UplinksService = class UplinksService {
    constructor(uplinkModel) {
        this.uplinkModel = uplinkModel;
    }
    async findAll(query) {
        const { limit = 50, device_id, application_id, format, start_date, end_date, } = query;
        const filter = {};
        if (device_id)
            filter.device_id = device_id;
        if (application_id)
            filter.application_id = application_id;
        if (format)
            filter["payload._format"] = format;
        if (start_date || end_date) {
            filter.ts = {};
            if (start_date)
                filter.ts.$gte = new Date(start_date);
            if (end_date)
                filter.ts.$lte = new Date(end_date);
        }
        const docs = await this.uplinkModel
            .find(filter)
            .sort({ ts: -1 })
            .limit(limit)
            .exec();
        return {
            success: true,
            count: docs.length,
            data: docs,
        };
    }
    async findByDevice(deviceId, limit = 20) {
        const docs = await this.uplinkModel
            .find({ device_id: deviceId })
            .sort({ ts: -1 })
            .limit(limit)
            .exec();
        return {
            success: true,
            device_id: deviceId,
            count: docs.length,
            data: docs,
        };
    }
    async getStats() {
        const totalUplinks = await this.uplinkModel.countDocuments();
        const deviceCount = await this.uplinkModel
            .distinct("device_id")
            .then((devices) => devices.length);
        const applicationCount = await this.uplinkModel
            .distinct("application_id")
            .then((apps) => apps.length);
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentUplinks = await this.uplinkModel.countDocuments({
            ts: { $gte: yesterday },
        });
        return {
            success: true,
            stats: {
                total_uplinks: totalUplinks,
                unique_devices: deviceCount,
                unique_applications: applicationCount,
                uplinks_last_24h: recentUplinks,
            },
        };
    }
    async findRecent(limit = 10) {
        const docs = await this.uplinkModel
            .find({})
            .sort({ ts: -1 })
            .limit(limit)
            .exec();
        return {
            success: true,
            count: docs.length,
            data: docs,
        };
    }
    async getApplications() {
        const applications = await this.uplinkModel.aggregate([
            {
                $group: {
                    _id: "$application_id",
                    uplink_count: { $sum: 1 },
                    last_uplink: { $max: "$ts" },
                    device_count: { $addToSet: "$device_id" },
                },
            },
            {
                $project: {
                    application_id: "$_id",
                    uplink_count: 1,
                    last_uplink: 1,
                    device_count: { $size: "$device_count" },
                    _id: 0,
                },
            },
            { $sort: { last_uplink: -1 } },
        ]);
        return {
            success: true,
            count: applications.length,
            data: applications,
        };
    }
    async getDevices(applicationId) {
        const match = applicationId ? { application_id: applicationId } : {};
        const devices = await this.uplinkModel.aggregate([
            { $match: match },
            {
                $group: {
                    _id: "$device_id",
                    application_id: { $first: "$application_id" },
                    uplink_count: { $sum: 1 },
                    last_uplink: { $max: "$ts" },
                    first_uplink: { $min: "$ts" },
                },
            },
            {
                $project: {
                    device_id: "$_id",
                    application_id: 1,
                    uplink_count: 1,
                    last_uplink: 1,
                    first_uplink: 1,
                    _id: 0,
                },
            },
            { $sort: { last_uplink: -1 } },
        ]);
        return {
            success: true,
            count: devices.length,
            data: devices,
        };
    }
    async simulateUplink(data) {
        const simulatedPayload = {
            temperature: Math.floor(Math.random() * 30) + 10,
            humidity: Math.floor(Math.random() * 40) + 40,
            battery: Math.floor(Math.random() * 30) + 70,
            timestamp: new Date().toISOString(),
            ...data.payload,
        };
        const uplink = new this.uplinkModel({
            topic: `application/${data.application_id}/device/${data.device_id}/event/up`,
            payload: {
                decoded_payload: simulatedPayload,
                metadata: {
                    device_id: data.device_id,
                    application_id: data.application_id,
                    f_port: data.f_port || 1,
                    f_cnt: Math.floor(Math.random() * 1000),
                },
                _format: "simulated",
                _parsed_at: new Date(),
                _topic: `application/${data.application_id}/device/${data.device_id}/event/up`,
            },
            ts: new Date(),
            device_id: data.device_id,
            application_id: data.application_id,
        });
        const result = await uplink.save();
        return {
            success: true,
            message: `Simulated uplink created for device ${data.device_id}`,
            uplink_id: result._id,
            data: result,
        };
    }
};
exports.UplinksService = UplinksService;
exports.UplinksService = UplinksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(uplink_schema_1.Uplink.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UplinksService);
//# sourceMappingURL=uplinks.service.js.map