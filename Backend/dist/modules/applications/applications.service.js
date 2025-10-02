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
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const uplink_schema_1 = require("../database/schemas/uplink.schema");
let ApplicationsService = class ApplicationsService {
    constructor(uplinkModel) {
        this.uplinkModel = uplinkModel;
    }
    async findAll() {
        const applications = await this.uplinkModel
            .aggregate([
            {
                $group: {
                    _id: "$application_id",
                    total_uplinks: { $sum: 1 },
                    device_count: { $addToSet: "$device_id" },
                    last_seen: { $max: "$ts" },
                    first_seen: { $min: "$ts" },
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
            applications: applications.map((app) => ({
                application_id: app._id,
                total_uplinks: app.total_uplinks,
                device_count: app.device_count.filter((device) => device).length,
                last_seen: app.last_seen,
                first_seen: app.first_seen,
            })),
        };
    }
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(uplink_schema_1.Uplink.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ApplicationsService);
//# sourceMappingURL=applications.service.js.map