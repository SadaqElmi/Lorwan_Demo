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
var MqttService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const mqtt = require("mqtt");
const schemas_1 = require("../database/schemas");
let MqttService = MqttService_1 = class MqttService {
    constructor(uplinkModel, downlinkModel) {
        this.uplinkModel = uplinkModel;
        this.downlinkModel = downlinkModel;
        this.logger = new common_1.Logger(MqttService_1.name);
    }
    async onModuleInit() {
        try {
            this.mqttClient = mqtt.connect(process.env.MQTT_URL || "mqtt://localhost:1883", {
                connectTimeout: 5000,
                reconnectPeriod: 10000,
            });
            this.mqttClient.on("connect", () => {
                this.logger.log("✅ Connected to MQTT broker");
                this.mqttClient.subscribe("application/+/device/+/event/up", (err) => {
                    if (err) {
                        this.logger.error("❌ Failed to subscribe to uplink topics:", err);
                    }
                    else {
                        this.logger.log("📡 Subscribed to uplink topics: application/+/device/+/event/up");
                    }
                });
                this.mqttClient.subscribe("eu868/gateway/+/event/+", (err) => {
                    if (err) {
                        this.logger.error("❌ Failed to subscribe to gateway topics:", err);
                    }
                    else {
                        this.logger.log("📡 Subscribed to gateway topics: eu868/gateway/+/event/+");
                    }
                });
            });
            this.mqttClient.on("message", async (topic, message) => {
                await this.handleMessage(topic, message);
            });
            this.mqttClient.on("error", (error) => {
                this.logger.warn("⚠️ MQTT client error (broker may not be available):", error.message);
            });
            this.mqttClient.on("close", () => {
                this.logger.warn("⚠️ MQTT connection closed");
            });
            this.mqttClient.on("offline", () => {
                this.logger.warn("⚠️ MQTT client offline");
            });
        }
        catch (error) {
            this.logger.warn("⚠️ Failed to initialize MQTT client:", error.message);
        }
    }
    async onModuleDestroy() {
        if (this.mqttClient) {
            this.mqttClient.end();
        }
    }
    async handleMessage(topic, message) {
        if (!this.mqttClient || !this.mqttClient.connected) {
            this.logger.warn("⚠️ MQTT client not connected, skipping message");
            return;
        }
        const payload = message.toString();
        this.logger.log(`📩 MQTT: ${topic} ${payload}`);
        const parsed = this.parsePayload(payload, topic);
        try {
            const uplink = new this.uplinkModel({
                topic,
                payload: parsed,
                ts: new Date(),
                device_id: parsed.metadata?.device_id || this.extractDeviceIdFromTopic(topic),
                application_id: parsed.metadata?.application_id ||
                    this.extractApplicationIdFromTopic(topic),
            });
            const result = await uplink.save();
            this.logger.log(`💾 Saved to MongoDB: ${result._id}`);
        }
        catch (error) {
            this.logger.error("❌ Failed to save to MongoDB:", error);
        }
    }
    parsePayload(payload, topic) {
        let parsed = {};
        try {
            const jsonParsed = JSON.parse(payload);
            if (jsonParsed.object && jsonParsed.object.uplink_message) {
                const uplinkData = jsonParsed.object.uplink_message;
                if (uplinkData.decoded_payload) {
                    parsed.decoded_payload = uplinkData.decoded_payload;
                }
                if (uplinkData.frm_payload) {
                    parsed.raw_payload = uplinkData.frm_payload;
                    try {
                        const decoded = Buffer.from(uplinkData.frm_payload, "base64");
                        parsed.decoded_raw = decoded.toString("hex");
                    }
                    catch (e) {
                        this.logger.warn("Could not decode base64 payload:", e.message);
                    }
                }
                parsed.metadata = {
                    device_id: uplinkData.device_id,
                    application_id: uplinkData.application_id,
                    f_port: uplinkData.f_port,
                    f_cnt: uplinkData.f_cnt,
                    rx_info: uplinkData.rx_info,
                    tx_info: uplinkData.tx_info,
                };
            }
            else {
                parsed = jsonParsed;
            }
            parsed._parsed_at = new Date();
            parsed._topic = topic;
            parsed._format = "json";
        }
        catch (jsonError) {
            if (/^[0-9a-fA-F]+$/.test(payload.trim())) {
                parsed = {
                    raw_hex: payload.trim(),
                    _format: "hex",
                    _parsed_at: new Date(),
                    _topic: topic,
                };
            }
            else if (/^[A-Za-z0-9+/]*={0,2}$/.test(payload.trim())) {
                try {
                    const decoded = Buffer.from(payload.trim(), "base64");
                    parsed = {
                        raw_base64: payload.trim(),
                        decoded_hex: decoded.toString("hex"),
                        decoded_text: decoded.toString("utf8"),
                        _format: "base64",
                        _parsed_at: new Date(),
                        _topic: topic,
                    };
                }
                catch (base64Error) {
                    parsed = {
                        raw: payload,
                        _format: "raw",
                        _parsed_at: new Date(),
                        _topic: topic,
                        _error: "Failed to parse as base64",
                    };
                }
            }
            else {
                parsed = {
                    raw: payload,
                    _format: "raw",
                    _parsed_at: new Date(),
                    _topic: topic,
                };
            }
        }
        return parsed;
    }
    extractDeviceIdFromTopic(topic) {
        const match = topic.match(/device\/([^/]+)/);
        return match ? match[1] : null;
    }
    extractApplicationIdFromTopic(topic) {
        const match = topic.match(/application\/([^/]+)/);
        return match ? match[1] : null;
    }
    async sendDownlink(applicationId, deviceEui, fPort, data, confirmed = false) {
        if (!this.mqttClient || !this.mqttClient.connected) {
            throw new Error("MQTT client not connected");
        }
        const downlinkTopic = `application/${applicationId}/device/${deviceEui}/command/down`;
        const downlinkPayload = {
            confirmed,
            fPort,
            data,
        };
        const downlink = new this.downlinkModel({
            device_eui: deviceEui,
            application_id: applicationId,
            f_port: fPort,
            data,
            confirmed,
            status: "pending",
            sent_at: new Date(),
        });
        const savedDownlink = await downlink.save();
        const downlinkId = savedDownlink._id.toString();
        return new Promise((resolve, reject) => {
            this.mqttClient.publish(downlinkTopic, JSON.stringify(downlinkPayload), { qos: 1 }, (error) => {
                if (error) {
                    this.logger.error(`❌ Failed to send downlink to ${deviceEui}:`, error);
                    this.downlinkModel
                        .findByIdAndUpdate(savedDownlink._id, {
                        status: "failed",
                        error_message: error.message,
                    })
                        .exec();
                    reject(error);
                }
                else {
                    this.logger.log(`📤 Downlink sent to ${deviceEui} on topic: ${downlinkTopic}`);
                    this.downlinkModel
                        .findByIdAndUpdate(savedDownlink._id, {
                        status: "sent",
                    })
                        .exec();
                    resolve(downlinkId);
                }
            });
        });
    }
    async getDownlinks(filter) {
        const { limit = 50, device_eui, application_id, status } = filter;
        const query = {};
        if (device_eui)
            query.device_eui = device_eui;
        if (application_id)
            query.application_id = application_id;
        if (status)
            query.status = status;
        const downlinks = await this.downlinkModel
            .find(query)
            .sort({ sent_at: -1 })
            .limit(limit)
            .exec();
        return {
            success: true,
            count: downlinks.length,
            data: downlinks,
        };
    }
    hexToBase64(hex) {
        return Buffer.from(hex, "hex").toString("base64");
    }
    base64ToHex(base64) {
        return Buffer.from(base64, "base64").toString("hex");
    }
};
exports.MqttService = MqttService;
exports.MqttService = MqttService = MqttService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(schemas_1.Uplink.name)),
    __param(1, (0, mongoose_1.InjectModel)(schemas_1.Downlink.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], MqttService);
//# sourceMappingURL=mqtt.service.js.map