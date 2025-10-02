import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as mqtt from "mqtt";
import { Uplink, Downlink } from "../database/schemas";
import { ParsedPayload } from "../../common/interfaces/uplink.interface";

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MqttService.name);
  private mqttClient: mqtt.MqttClient;

  constructor(
    @InjectModel(Uplink.name) private uplinkModel: Model<Uplink>,
    @InjectModel(Downlink.name) private downlinkModel: Model<Downlink>
  ) {}

  async onModuleInit() {
    try {
      this.mqttClient = mqtt.connect(
        process.env.MQTT_URL || "mqtt://localhost:1883",
        {
          connectTimeout: 5000,
          reconnectPeriod: 10000,
        }
      );

      this.mqttClient.on("connect", () => {
        this.logger.log("✅ Connected to MQTT broker");

        // Subscribe to all uplink topics to receive dynamic payloads
        this.mqttClient.subscribe("application/+/device/+/event/up", (err) => {
          if (err) {
            this.logger.error("❌ Failed to subscribe to uplink topics:", err);
          } else {
            this.logger.log(
              "📡 Subscribed to uplink topics: application/+/device/+/event/up"
            );
          }
        });

        // Also subscribe to gateway events for comprehensive monitoring
        this.mqttClient.subscribe("eu868/gateway/+/event/+", (err) => {
          if (err) {
            this.logger.error("❌ Failed to subscribe to gateway topics:", err);
          } else {
            this.logger.log(
              "📡 Subscribed to gateway topics: eu868/gateway/+/event/+"
            );
          }
        });
      });

      this.mqttClient.on("message", async (topic, message) => {
        await this.handleMessage(topic, message);
      });

      this.mqttClient.on("error", (error) => {
        this.logger.warn(
          "⚠️ MQTT client error (broker may not be available):",
          error.message
        );
      });

      this.mqttClient.on("close", () => {
        this.logger.warn("⚠️ MQTT connection closed");
      });

      this.mqttClient.on("offline", () => {
        this.logger.warn("⚠️ MQTT client offline");
      });
    } catch (error) {
      this.logger.warn("⚠️ Failed to initialize MQTT client:", error.message);
    }
  }

  async onModuleDestroy() {
    if (this.mqttClient) {
      this.mqttClient.end();
    }
  }

  private async handleMessage(topic: string, message: Buffer) {
    if (!this.mqttClient || !this.mqttClient.connected) {
      this.logger.warn("⚠️ MQTT client not connected, skipping message");
      return;
    }

    const payload = message.toString();
    this.logger.log(`📩 MQTT: ${topic} ${payload}`);

    // Use enhanced parsing
    const parsed = this.parsePayload(payload, topic);

    // Save into MongoDB with enhanced structure
    try {
      const uplink = new this.uplinkModel({
        topic,
        payload: parsed,
        ts: new Date(),
        device_id:
          parsed.metadata?.device_id || this.extractDeviceIdFromTopic(topic),
        application_id:
          parsed.metadata?.application_id ||
          this.extractApplicationIdFromTopic(topic),
      });

      const result = await uplink.save();
      this.logger.log(`💾 Saved to MongoDB: ${result._id}`);
    } catch (error) {
      this.logger.error("❌ Failed to save to MongoDB:", error);
    }
  }

  private parsePayload(payload: string, topic: string): ParsedPayload {
    let parsed: ParsedPayload = {} as ParsedPayload;

    try {
      // Try to parse as JSON first
      const jsonParsed = JSON.parse(payload);

      // If it's a ChirpStack uplink event, extract the actual payload
      if (jsonParsed.object && jsonParsed.object.uplink_message) {
        const uplinkData = jsonParsed.object.uplink_message;

        // Extract decoded payload if available
        if (uplinkData.decoded_payload) {
          parsed.decoded_payload = uplinkData.decoded_payload;
        }

        // Extract raw payload (base64 encoded)
        if (uplinkData.frm_payload) {
          parsed.raw_payload = uplinkData.frm_payload;
          // Try to decode base64 payload
          try {
            const decoded = Buffer.from(uplinkData.frm_payload, "base64");
            parsed.decoded_raw = decoded.toString("hex");
          } catch (e) {
            this.logger.warn("Could not decode base64 payload:", e.message);
          }
        }

        // Extract metadata
        parsed.metadata = {
          device_id: uplinkData.device_id,
          application_id: uplinkData.application_id,
          f_port: uplinkData.f_port,
          f_cnt: uplinkData.f_cnt,
          rx_info: uplinkData.rx_info,
          tx_info: uplinkData.tx_info,
        };
      } else {
        parsed = jsonParsed;
      }

      // Add parsing metadata
      parsed._parsed_at = new Date();
      parsed._topic = topic;
      parsed._format = "json";
    } catch (jsonError) {
      // If not JSON, try to parse as other formats

      // Check if it's hex data
      if (/^[0-9a-fA-F]+$/.test(payload.trim())) {
        parsed = {
          raw_hex: payload.trim(),
          _format: "hex",
          _parsed_at: new Date(),
          _topic: topic,
        } as ParsedPayload;
      }
      // Check if it's base64
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
          } as ParsedPayload;
        } catch (base64Error) {
          parsed = {
            raw: payload,
            _format: "raw",
            _parsed_at: new Date(),
            _topic: topic,
            _error: "Failed to parse as base64",
          } as ParsedPayload;
        }
      }
      // Fallback to raw
      else {
        parsed = {
          raw: payload,
          _format: "raw",
          _parsed_at: new Date(),
          _topic: topic,
        } as ParsedPayload;
      }
    }

    return parsed;
  }

  private extractDeviceIdFromTopic(topic: string): string | null {
    const match = topic.match(/device\/([^/]+)/);
    return match ? match[1] : null;
  }

  private extractApplicationIdFromTopic(topic: string): string | null {
    const match = topic.match(/application\/([^/]+)/);
    return match ? match[1] : null;
  }

  /**
   * Send downlink message to device via MQTT
   */
  async sendDownlink(
    applicationId: string,
    deviceEui: string,
    fPort: number,
    data: string,
    confirmed: boolean = false
  ): Promise<string> {
    if (!this.mqttClient || !this.mqttClient.connected) {
      throw new Error("MQTT client not connected");
    }

    const downlinkTopic = `application/${applicationId}/device/${deviceEui}/command/down`;
    const downlinkPayload = {
      confirmed,
      fPort,
      data, // should be base64 encoded
    };

    // Save downlink to database for tracking
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
      this.mqttClient.publish(
        downlinkTopic,
        JSON.stringify(downlinkPayload),
        { qos: 1 },
        (error) => {
          if (error) {
            this.logger.error(
              `❌ Failed to send downlink to ${deviceEui}:`,
              error
            );
            // Update status to failed
            this.downlinkModel
              .findByIdAndUpdate(savedDownlink._id, {
                status: "failed",
                error_message: error.message,
              })
              .exec();
            reject(error);
          } else {
            this.logger.log(
              `📤 Downlink sent to ${deviceEui} on topic: ${downlinkTopic}`
            );
            // Update status to sent
            this.downlinkModel
              .findByIdAndUpdate(savedDownlink._id, {
                status: "sent",
              })
              .exec();
            resolve(downlinkId);
          }
        }
      );
    });
  }

  /**
   * Get downlink history
   */
  async getDownlinks(filter: {
    limit?: number;
    device_eui?: string;
    application_id?: string;
    status?: string;
  }) {
    const { limit = 50, device_eui, application_id, status } = filter;

    const query: any = {};
    if (device_eui) query.device_eui = device_eui;
    if (application_id) query.application_id = application_id;
    if (status) query.status = status;

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

  /**
   * Convert hex string to base64
   */
  hexToBase64(hex: string): string {
    return Buffer.from(hex, "hex").toString("base64");
  }

  /**
   * Convert base64 to hex string
   */
  base64ToHex(base64: string): string {
    return Buffer.from(base64, "base64").toString("hex");
  }
}
