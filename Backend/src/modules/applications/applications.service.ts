import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Uplink } from "../database/schemas/uplink.schema";

@Injectable()
export class ApplicationsService {
  constructor(@InjectModel(Uplink.name) private uplinkModel: Model<Uplink>) {}

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
}
