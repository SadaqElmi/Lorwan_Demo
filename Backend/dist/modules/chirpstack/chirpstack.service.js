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
exports.ChirpstackService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const grpc_js_1 = require("@grpc/grpc-js");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const schemas_1 = require("../database/schemas");
const tenant_grpc_pb_1 = require("@chirpstack/chirpstack-api/api/tenant_grpc_pb");
const application_grpc_pb_1 = require("@chirpstack/chirpstack-api/api/application_grpc_pb");
const device_grpc_pb_1 = require("@chirpstack/chirpstack-api/api/device_grpc_pb");
const device_profile_grpc_pb_1 = require("@chirpstack/chirpstack-api/api/device_profile_grpc_pb");
const tenant_pb_1 = require("@chirpstack/chirpstack-api/api/tenant_pb");
const application_pb_1 = require("@chirpstack/chirpstack-api/api/application_pb");
const device_pb_1 = require("@chirpstack/chirpstack-api/api/device_pb");
const device_profile_pb_1 = require("@chirpstack/chirpstack-api/api/device_profile_pb");
const common_pb_1 = require("@chirpstack/chirpstack-api/common/common_pb");
function getRegionEnum(regionString) {
    const regionMap = {
        EU868: common_pb_1.Region.EU868,
        US915: common_pb_1.Region.US915,
        CN779: common_pb_1.Region.CN779,
        EU433: common_pb_1.Region.EU433,
        AU915: common_pb_1.Region.AU915,
        CN470: common_pb_1.Region.CN470,
        AS923: common_pb_1.Region.AS923,
        AS923_2: common_pb_1.Region.AS923_2,
        AS923_3: common_pb_1.Region.AS923_3,
        AS923_4: common_pb_1.Region.AS923_4,
        KR920: common_pb_1.Region.KR920,
        IN865: common_pb_1.Region.IN865,
        RU864: common_pb_1.Region.RU864,
        ISM2400: common_pb_1.Region.ISM2400,
    };
    return regionMap[regionString];
}
let ChirpstackService = class ChirpstackService {
    constructor(configService, tenantModel, applicationModel, deviceModel) {
        this.configService = configService;
        this.tenantModel = tenantModel;
        this.applicationModel = applicationModel;
        this.deviceModel = deviceModel;
        const server = this.configService.get("CHIRPSTACK_SERVER") ||
            process.env.CHIRPSTACK_SERVER ||
            "localhost:8080";
        const apiToken = this.configService.get("CHIRPSTACK_API_TOKEN") ||
            process.env.CHIRPSTACK_API_TOKEN ||
            "";
        const address = server.replace(/^https?:\/\//, "");
        this.tenantClient = new tenant_grpc_pb_1.TenantServiceClient(address, grpc_js_1.credentials.createInsecure());
        this.applicationClient = new application_grpc_pb_1.ApplicationServiceClient(address, grpc_js_1.credentials.createInsecure());
        this.deviceClient = new device_grpc_pb_1.DeviceServiceClient(address, grpc_js_1.credentials.createInsecure());
        this.deviceProfileClient = new device_profile_grpc_pb_1.DeviceProfileServiceClient(address, grpc_js_1.credentials.createInsecure());
        this.metadata = new grpc_js_1.Metadata();
        if (apiToken) {
            this.metadata.add("authorization", `Bearer ${apiToken}`);
        }
        else {
            console.warn("⚠️ No ChirpStack API token provided - some operations may fail");
        }
    }
    async createTenant(name, meta) {
        const tenant = new tenant_pb_1.Tenant();
        tenant.setName(name);
        if (meta)
            tenant.setDescription(JSON.stringify(meta));
        const req = new tenant_pb_1.CreateTenantRequest();
        req.setTenant(tenant);
        const res = await new Promise((resolve, reject) => {
            this.tenantClient.create(req, this.metadata, (err, response) => {
                if (err)
                    return reject(err);
                resolve(response);
            });
        });
        const id = res.getId();
        const saved = await this.tenantModel.create({
            name,
            chirpstack_id: id,
            meta,
        });
        return { id, saved };
    }
    async listTenants(limit = 50, offset = 0, search) {
        const req = new tenant_pb_1.ListTenantsRequest();
        req.setLimit(limit);
        req.setOffset(offset);
        if (search)
            req.setSearch(search);
        const res = await new Promise((resolve, reject) => {
            this.tenantClient.list(req, this.metadata, (err, response) => {
                if (err)
                    return reject(err);
                resolve(response);
            });
        });
        return res.toObject();
    }
    async updateTenant(id, fields) {
        const tenant = new tenant_pb_1.Tenant();
        tenant.setId(id);
        if (fields.name !== undefined)
            tenant.setName(fields.name);
        if (fields.description !== undefined)
            tenant.setDescription(fields.description);
        const req = new tenant_pb_1.UpdateTenantRequest();
        req.setTenant(tenant);
        await new Promise((resolve, reject) => {
            this.tenantClient.update(req, this.metadata, (err) => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
    async deleteTenant(id) {
        const req = new tenant_pb_1.DeleteTenantRequest();
        req.setId(id);
        await new Promise((resolve, reject) => {
            this.tenantClient.delete(req, this.metadata, (err) => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
    async createApplication(name, tenantId, meta) {
        const app = new application_pb_1.Application();
        app.setName(name);
        app.setTenantId(tenantId);
        if (meta)
            app.setDescription(JSON.stringify(meta));
        const req = new application_pb_1.CreateApplicationRequest();
        req.setApplication(app);
        const res = await new Promise((resolve, reject) => {
            this.applicationClient.create(req, this.metadata, (err, response) => {
                if (err)
                    return reject(err);
                resolve(response);
            });
        });
        const id = res.getId();
        const saved = await this.applicationModel.create({
            name,
            tenant_chirpstack_id: tenantId,
            chirpstack_id: id,
            meta,
        });
        return { id, saved };
    }
    async listApplications(tenantId, limit = 50, offset = 0, search) {
        const req = new application_pb_1.ListApplicationsRequest();
        req.setTenantId(tenantId);
        req.setLimit(limit);
        req.setOffset(offset);
        if (search)
            req.setSearch(search);
        const res = await new Promise((resolve, reject) => {
            this.applicationClient.list(req, this.metadata, (err, response) => {
                if (err)
                    return reject(err);
                resolve(response);
            });
        });
        return res.toObject();
    }
    async updateApplication(id, fields) {
        const app = new application_pb_1.Application();
        app.setId(id);
        if (fields.name !== undefined)
            app.setName(fields.name);
        if (fields.description !== undefined)
            app.setDescription(fields.description);
        const req = new application_pb_1.UpdateApplicationRequest();
        req.setApplication(app);
        await new Promise((resolve, reject) => {
            this.applicationClient.update(req, this.metadata, (err) => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
    async deleteApplication(id) {
        const req = new application_pb_1.DeleteApplicationRequest();
        req.setId(id);
        await new Promise((resolve, reject) => {
            this.applicationClient.delete(req, this.metadata, (err) => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
    async createDevice(name, devEui, applicationId, meta) {
        try {
            const getReq = new device_pb_1.GetDeviceRequest();
            getReq.setDevEui(devEui);
            await new Promise((resolve, reject) => {
                this.deviceClient.get(getReq, this.metadata, (err) => {
                    if (err) {
                        resolve();
                    }
                    else {
                        reject(new Error(`Device with DevEUI ${devEui} already exists`));
                    }
                });
            });
        }
        catch (error) {
            if (error.message.includes("already exists")) {
                throw error;
            }
        }
        const device = new device_pb_1.Device();
        device.setName(name);
        device.setDevEui(devEui);
        device.setApplicationId(applicationId);
        if (meta) {
            device.setDescription(JSON.stringify(meta));
            if (meta.deviceProfileId) {
                device.setDeviceProfileId(meta.deviceProfileId);
            }
        }
        const req = new device_pb_1.CreateDeviceRequest();
        req.setDevice(device);
        await new Promise((resolve, reject) => {
            this.deviceClient.create(req, this.metadata, (err) => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
        const id = devEui;
        const saved = await this.deviceModel.create({
            name,
            dev_eui: devEui,
            application_chirpstack_id: applicationId,
            chirpstack_id: id,
            meta,
        });
        return { id, saved };
    }
    async listDevices(applicationId, limit = 50, offset = 0, search) {
        const req = new device_pb_1.ListDevicesRequest();
        req.setApplicationId(applicationId);
        req.setLimit(limit);
        req.setOffset(offset);
        if (search)
            req.setSearch(search);
        const res = await new Promise((resolve, reject) => {
            this.deviceClient.list(req, this.metadata, (err, response) => {
                if (err)
                    return reject(err);
                resolve(response);
            });
        });
        return res.toObject();
    }
    async updateDevice(devEui, fields) {
        try {
            console.log("🔧 ChirpStack updateDevice called:", { devEui, fields });
            const getReq = new device_pb_1.GetDeviceRequest();
            getReq.setDevEui(devEui);
            const currentDevice = await new Promise((resolve, reject) => {
                this.deviceClient.get(getReq, this.metadata, (err, response) => {
                    if (err) {
                        console.error("❌ Failed to get current device:", err);
                        return reject(new Error(`Device with DevEUI ${devEui} not found`));
                    }
                    resolve(response.getDevice());
                });
            });
            console.log("🔧 Current device info:", {
                devEui: currentDevice.getDevEui(),
                name: currentDevice.getName(),
                applicationId: currentDevice.getApplicationId(),
                deviceProfileId: currentDevice.getDeviceProfileId(),
            });
            const device = new device_pb_1.Device();
            device.setDevEui(devEui);
            device.setApplicationId(currentDevice.getApplicationId());
            if (fields.name !== undefined) {
                device.setName(fields.name);
            }
            else {
                device.setName(currentDevice.getName());
            }
            if (fields.description !== undefined) {
                device.setDescription(fields.description);
            }
            else if (currentDevice.getDescription()) {
                device.setDescription(currentDevice.getDescription());
            }
            if (fields.deviceProfileId !== undefined) {
                device.setDeviceProfileId(fields.deviceProfileId);
            }
            else if (currentDevice.getDeviceProfileId()) {
                device.setDeviceProfileId(currentDevice.getDeviceProfileId());
            }
            const req = new device_pb_1.UpdateDeviceRequest();
            req.setDevice(device);
            console.log("🔧 Sending update request to ChirpStack...");
            await new Promise((resolve, reject) => {
                this.deviceClient.update(req, this.metadata, (err) => {
                    if (err) {
                        console.error("❌ ChirpStack update error:", {
                            code: err.code,
                            details: err.details,
                            message: err.message,
                            metadata: err.metadata,
                        });
                        if (err.code === 16) {
                            return reject(new Error("ChirpStack authentication failed. Please check API token configuration."));
                        }
                        else if (err.code === 5) {
                            return reject(new Error(`Device with DevEUI ${devEui} not found`));
                        }
                        else if (err.code === 3) {
                            return reject(new Error(`Invalid device data: ${err.details}`));
                        }
                        return reject(new Error(`ChirpStack API error: ${err.message}`));
                    }
                    console.log("✅ ChirpStack device updated successfully");
                    resolve();
                });
            });
        }
        catch (error) {
            console.error("❌ Error in updateDevice:", error);
            throw error;
        }
    }
    async deleteDevice(devEui) {
        const req = new device_pb_1.DeleteDeviceRequest();
        req.setDevEui(devEui);
        await new Promise((resolve, reject) => {
            this.deviceClient.delete(req, this.metadata, (err) => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
    async listDeviceProfiles(tenantId, limit = 50, offset = 0, search) {
        const req = new device_profile_pb_1.ListDeviceProfilesRequest();
        req.setTenantId(tenantId);
        req.setLimit(limit);
        req.setOffset(offset);
        if (search)
            req.setSearch(search);
        const res = await new Promise((resolve, reject) => {
            this.deviceProfileClient.list(req, this.metadata, (err, response) => {
                if (err)
                    return reject(err);
                resolve(response);
            });
        });
        return res.toObject();
    }
    async getDeviceProfile(id) {
        const req = new device_profile_pb_1.GetDeviceProfileRequest();
        req.setId(id);
        const res = await new Promise((resolve, reject) => {
            this.deviceProfileClient.get(req, this.metadata, (err, response) => {
                if (err)
                    return reject(err);
                resolve(response);
            });
        });
        return res.toObject();
    }
    async createDeviceProfile(name, tenantId, description, region) {
        const deviceProfile = new device_profile_pb_1.DeviceProfile();
        deviceProfile.setName(name);
        deviceProfile.setTenantId(tenantId);
        if (description)
            deviceProfile.setDescription(description);
        if (region) {
            const regionEnum = getRegionEnum(region);
            if (regionEnum !== undefined) {
                deviceProfile.setRegion(regionEnum);
            }
        }
        const req = new device_profile_pb_1.CreateDeviceProfileRequest();
        req.setDeviceProfile(deviceProfile);
        const res = await new Promise((resolve, reject) => {
            this.deviceProfileClient.create(req, this.metadata, (err, response) => {
                if (err)
                    return reject(err);
                resolve(response);
            });
        });
        return { id: res.getId() };
    }
    async updateDeviceProfile(id, fields) {
        const getReq = new device_profile_pb_1.GetDeviceProfileRequest();
        getReq.setId(id);
        const getRes = await new Promise((resolve, reject) => {
            this.deviceProfileClient.get(getReq, this.metadata, (err, response) => {
                if (err)
                    return reject(err);
                resolve(response);
            });
        });
        const existingProfile = getRes.getDeviceProfile();
        if (fields.name)
            existingProfile.setName(fields.name);
        if (fields.description)
            existingProfile.setDescription(fields.description);
        if (fields.region) {
            const regionEnum = getRegionEnum(fields.region);
            if (regionEnum !== undefined) {
                existingProfile.setRegion(regionEnum);
            }
        }
        const req = new device_profile_pb_1.UpdateDeviceProfileRequest();
        req.setDeviceProfile(existingProfile);
        await new Promise((resolve, reject) => {
            this.deviceProfileClient.update(req, this.metadata, (err) => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
    async deleteDeviceProfile(id) {
        const req = new device_profile_pb_1.DeleteDeviceProfileRequest();
        req.setId(id);
        await new Promise((resolve, reject) => {
            this.deviceProfileClient.delete(req, this.metadata, (err) => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
};
exports.ChirpstackService = ChirpstackService;
exports.ChirpstackService = ChirpstackService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(schemas_1.TenantRef.name)),
    __param(2, (0, mongoose_1.InjectModel)(schemas_1.ApplicationRef.name)),
    __param(3, (0, mongoose_1.InjectModel)(schemas_1.DeviceRef.name)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ChirpstackService);
//# sourceMappingURL=chirpstack.service.js.map