import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Uplink } from "../database/schemas/uplink.schema";
import { CreateDeviceDto } from "../../common/dto/uplink.dto";

@Injectable()
export class DevicesService {
  constructor(@InjectModel(Uplink.name) private uplinkModel: Model<Uplink>) {}

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

  async create(createDeviceDto: CreateDeviceDto) {
    const { device_id, application_id, payload_template } = createDeviceDto;

    // Create a test uplink for the new device
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
}
