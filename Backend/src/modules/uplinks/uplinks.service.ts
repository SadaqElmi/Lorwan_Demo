import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Uplink } from "../database/schemas/uplink.schema";
import { GetUplinksDto } from "../../common/dto/uplink.dto";

@Injectable()
export class UplinksService {
  constructor(@InjectModel(Uplink.name) private uplinkModel: Model<Uplink>) {}

  async findAll(query: GetUplinksDto) {
    const {
      limit = 50,
      device_id,
      application_id,
      format,
      start_date,
      end_date,
    } = query;

    // Build query filter
    const filter: any = {};
    if (device_id) filter.device_id = device_id;
    if (application_id) filter.application_id = application_id;
    if (format) filter["payload._format"] = format;

    // Add date range filter
    if (start_date || end_date) {
      filter.ts = {};
      if (start_date) filter.ts.$gte = new Date(start_date);
      if (end_date) filter.ts.$lte = new Date(end_date);
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

  async findByDevice(deviceId: string, limit: number = 20) {
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

    // Get recent activity (last 24 hours)
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

  async findRecent(limit: number = 10) {
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

  async getDevices(applicationId?: string) {
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

  async simulateUplink(data: {
    device_id: string;
    application_id: string;
    payload?: any;
    f_port?: number;
  }) {
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
}
