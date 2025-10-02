import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Metadata, credentials } from "@grpc/grpc-js";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TenantRef, ApplicationRef, DeviceRef } from "../database/schemas";

// ChirpStack v4 service clients & messages
// Service clients
import { TenantServiceClient } from "@chirpstack/chirpstack-api/api/tenant_grpc_pb";
import { ApplicationServiceClient } from "@chirpstack/chirpstack-api/api/application_grpc_pb";
import { DeviceServiceClient } from "@chirpstack/chirpstack-api/api/device_grpc_pb";
import { DeviceProfileServiceClient } from "@chirpstack/chirpstack-api/api/device_profile_grpc_pb";
// Messages
import {
  Tenant,
  CreateTenantRequest,
  CreateTenantResponse,
  GetTenantRequest,
  UpdateTenantRequest,
  DeleteTenantRequest,
  ListTenantsRequest,
  ListTenantsResponse,
} from "@chirpstack/chirpstack-api/api/tenant_pb";
import {
  Application,
  CreateApplicationRequest,
  CreateApplicationResponse,
  GetApplicationRequest,
  UpdateApplicationRequest,
  DeleteApplicationRequest,
  ListApplicationsRequest,
  ListApplicationsResponse,
} from "@chirpstack/chirpstack-api/api/application_pb";
import {
  Device,
  CreateDeviceRequest,
  GetDeviceRequest,
  UpdateDeviceRequest,
  DeleteDeviceRequest,
  ListDevicesRequest,
  ListDevicesResponse,
} from "@chirpstack/chirpstack-api/api/device_pb";
import {
  DeviceProfile,
  CreateDeviceProfileRequest,
  CreateDeviceProfileResponse,
  GetDeviceProfileRequest,
  UpdateDeviceProfileRequest,
  DeleteDeviceProfileRequest,
  ListDeviceProfilesRequest,
  ListDeviceProfilesResponse,
} from "@chirpstack/chirpstack-api/api/device_profile_pb";
import { Region } from "@chirpstack/chirpstack-api/common/common_pb";

// Helper function to convert string region to Region enum
function getRegionEnum(regionString: string): number | undefined {
  const regionMap: { [key: string]: number } = {
    EU868: Region.EU868,
    US915: Region.US915,
    CN779: Region.CN779,
    EU433: Region.EU433,
    AU915: Region.AU915,
    CN470: Region.CN470,
    AS923: Region.AS923,
    AS923_2: Region.AS923_2,
    AS923_3: Region.AS923_3,
    AS923_4: Region.AS923_4,
    KR920: Region.KR920,
    IN865: Region.IN865,
    RU864: Region.RU864,
    ISM2400: Region.ISM2400,
  };
  return regionMap[regionString];
}

@Injectable()
export class ChirpstackService {
  private readonly tenantClient: TenantServiceClient;
  private readonly applicationClient: ApplicationServiceClient;
  private readonly deviceClient: DeviceServiceClient;
  private readonly deviceProfileClient: DeviceProfileServiceClient;
  private readonly metadata: Metadata;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(TenantRef.name) private tenantModel: Model<TenantRef>,
    @InjectModel(ApplicationRef.name)
    private applicationModel: Model<ApplicationRef>,
    @InjectModel(DeviceRef.name) private deviceModel: Model<DeviceRef>
  ) {
    const server =
      this.configService.get<string>("CHIRPSTACK_SERVER") ||
      process.env.CHIRPSTACK_SERVER ||
      "localhost:8080";
    const apiToken =
      this.configService.get<string>("CHIRPSTACK_API_TOKEN") ||
      process.env.CHIRPSTACK_API_TOKEN ||
      "";

    const address = server.replace(/^https?:\/\//, "");
    this.tenantClient = new TenantServiceClient(
      address,
      credentials.createInsecure()
    );
    this.applicationClient = new ApplicationServiceClient(
      address,
      credentials.createInsecure()
    );
    this.deviceClient = new DeviceServiceClient(
      address,
      credentials.createInsecure()
    );
    this.deviceProfileClient = new DeviceProfileServiceClient(
      address,
      credentials.createInsecure()
    );
    this.metadata = new Metadata();
    if (apiToken) {
      this.metadata.add("authorization", `Bearer ${apiToken}`);
    }
  }

  async createTenant(name: string, meta?: any) {
    const tenant = new Tenant();
    tenant.setName(name);
    if (meta) tenant.setDescription(JSON.stringify(meta));

    const req = new CreateTenantRequest();
    req.setTenant(tenant);

    const res: CreateTenantResponse = await new Promise((resolve, reject) => {
      this.tenantClient.create(req, this.metadata, (err, response) => {
        if (err) return reject(err);
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

  async listTenants(limit: number = 50, offset: number = 0, search?: string) {
    const req = new ListTenantsRequest();
    req.setLimit(limit);
    req.setOffset(offset);
    if (search) req.setSearch(search);
    const res: ListTenantsResponse = await new Promise((resolve, reject) => {
      this.tenantClient.list(req, this.metadata, (err, response) => {
        if (err) return reject(err);
        resolve(response);
      });
    });
    return res.toObject();
  }

  async updateTenant(
    id: string,
    fields: Partial<{ name: string; description: string }>
  ) {
    const tenant = new Tenant();
    tenant.setId(id);
    if (fields.name !== undefined) tenant.setName(fields.name);
    if (fields.description !== undefined)
      tenant.setDescription(fields.description);
    const req = new UpdateTenantRequest();
    req.setTenant(tenant);
    await new Promise<void>((resolve, reject) => {
      this.tenantClient.update(req, this.metadata, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  async deleteTenant(id: string) {
    const req = new DeleteTenantRequest();
    req.setId(id);
    await new Promise<void>((resolve, reject) => {
      this.tenantClient.delete(req, this.metadata, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  async createApplication(name: string, tenantId: string, meta?: any) {
    const app = new Application();
    app.setName(name);
    app.setTenantId(tenantId);
    if (meta) app.setDescription(JSON.stringify(meta));

    const req = new CreateApplicationRequest();
    req.setApplication(app);

    const res: CreateApplicationResponse = await new Promise(
      (resolve, reject) => {
        this.applicationClient.create(req, this.metadata, (err, response) => {
          if (err) return reject(err);
          resolve(response);
        });
      }
    );

    const id = res.getId();
    const saved = await this.applicationModel.create({
      name,
      tenant_chirpstack_id: tenantId,
      chirpstack_id: id,
      meta,
    });
    return { id, saved };
  }

  async listApplications(
    tenantId: string,
    limit: number = 50,
    offset: number = 0,
    search?: string
  ) {
    const req = new ListApplicationsRequest();
    req.setTenantId(tenantId);
    req.setLimit(limit);
    req.setOffset(offset);
    if (search) req.setSearch(search);
    const res: ListApplicationsResponse = await new Promise(
      (resolve, reject) => {
        this.applicationClient.list(req, this.metadata, (err, response) => {
          if (err) return reject(err);
          resolve(response);
        });
      }
    );
    return res.toObject();
  }

  async updateApplication(
    id: string,
    fields: Partial<{ name: string; description: string }>
  ) {
    const app = new Application();
    app.setId(id);
    if (fields.name !== undefined) app.setName(fields.name);
    if (fields.description !== undefined)
      app.setDescription(fields.description);
    const req = new UpdateApplicationRequest();
    req.setApplication(app);
    await new Promise<void>((resolve, reject) => {
      this.applicationClient.update(req, this.metadata, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  async deleteApplication(id: string) {
    const req = new DeleteApplicationRequest();
    req.setId(id);
    await new Promise<void>((resolve, reject) => {
      this.applicationClient.delete(req, this.metadata, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  async createDevice(
    name: string,
    devEui: string,
    applicationId: string,
    meta?: any
  ) {
    // First check if device already exists
    try {
      const getReq = new GetDeviceRequest();
      getReq.setDevEui(devEui);
      await new Promise<void>((resolve, reject) => {
        this.deviceClient.get(getReq, this.metadata, (err) => {
          if (err) {
            // Device doesn't exist, which is what we want
            resolve();
          } else {
            // Device exists
            reject(new Error(`Device with DevEUI ${devEui} already exists`));
          }
        });
      });
    } catch (error) {
      if (error.message.includes("already exists")) {
        throw error;
      }
      // If it's a different error (like device not found), continue with creation
    }

    const device = new Device();
    device.setName(name);
    device.setDevEui(devEui);
    device.setApplicationId(applicationId);
    if (meta) {
      device.setDescription(JSON.stringify(meta));
      // Set device profile ID if provided in meta
      if (meta.deviceProfileId) {
        device.setDeviceProfileId(meta.deviceProfileId);
      }
    }

    const req = new CreateDeviceRequest();
    req.setDevice(device);

    await new Promise<void>((resolve, reject) => {
      this.deviceClient.create(req, this.metadata, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    const id = devEui; // Device create returns Empty; use DevEUI as identifier
    const saved = await this.deviceModel.create({
      name,
      dev_eui: devEui,
      application_chirpstack_id: applicationId,
      chirpstack_id: id,
      meta,
    });
    return { id, saved };
  }

  async listDevices(
    applicationId: string,
    limit: number = 50,
    offset: number = 0,
    search?: string
  ) {
    const req = new ListDevicesRequest();
    req.setApplicationId(applicationId);
    req.setLimit(limit);
    req.setOffset(offset);
    if (search) req.setSearch(search);
    const res: ListDevicesResponse = await new Promise((resolve, reject) => {
      this.deviceClient.list(req, this.metadata, (err, response) => {
        if (err) return reject(err);
        resolve(response);
      });
    });
    return res.toObject();
  }

  async updateDevice(
    devEui: string,
    fields: Partial<{
      name: string;
      description: string;
      deviceProfileId: string;
    }>
  ) {
    const device = new Device();
    device.setDevEui(devEui);
    if (fields.name !== undefined) device.setName(fields.name);
    if (fields.description !== undefined)
      device.setDescription(fields.description);
    if (fields.deviceProfileId !== undefined)
      device.setDeviceProfileId(fields.deviceProfileId);
    const req = new UpdateDeviceRequest();
    req.setDevice(device);
    await new Promise<void>((resolve, reject) => {
      this.deviceClient.update(req, this.metadata, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  async deleteDevice(devEui: string) {
    const req = new DeleteDeviceRequest();
    req.setDevEui(devEui);
    await new Promise<void>((resolve, reject) => {
      this.deviceClient.delete(req, this.metadata, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  async listDeviceProfiles(
    tenantId: string,
    limit: number = 50,
    offset: number = 0,
    search?: string
  ) {
    const req = new ListDeviceProfilesRequest();
    req.setTenantId(tenantId);
    req.setLimit(limit);
    req.setOffset(offset);
    if (search) req.setSearch(search);

    const res: ListDeviceProfilesResponse = await new Promise(
      (resolve, reject) => {
        this.deviceProfileClient.list(req, this.metadata, (err, response) => {
          if (err) return reject(err);
          resolve(response);
        });
      }
    );
    return res.toObject();
  }

  async getDeviceProfile(id: string) {
    const req = new GetDeviceProfileRequest();
    req.setId(id);

    const res = await new Promise((resolve, reject) => {
      this.deviceProfileClient.get(req, this.metadata, (err, response) => {
        if (err) return reject(err);
        resolve(response);
      });
    });
    return (res as any).toObject();
  }

  async createDeviceProfile(
    name: string,
    tenantId: string,
    description?: string,
    region?: string
  ) {
    const deviceProfile = new DeviceProfile();
    deviceProfile.setName(name);
    deviceProfile.setTenantId(tenantId);
    if (description) deviceProfile.setDescription(description);
    if (region) {
      const regionEnum = getRegionEnum(region);
      if (regionEnum !== undefined) {
        deviceProfile.setRegion(regionEnum as any);
      }
    }

    const req = new CreateDeviceProfileRequest();
    req.setDeviceProfile(deviceProfile);

    const res: CreateDeviceProfileResponse = await new Promise(
      (resolve, reject) => {
        this.deviceProfileClient.create(req, this.metadata, (err, response) => {
          if (err) return reject(err);
          resolve(response);
        });
      }
    );
    return { id: res.getId() };
  }

  async updateDeviceProfile(
    id: string,
    fields: Partial<{
      name: string;
      description: string;
      region: string;
    }>
  ) {
    // First get the existing device profile
    const getReq = new GetDeviceProfileRequest();
    getReq.setId(id);

    const getRes = await new Promise((resolve, reject) => {
      this.deviceProfileClient.get(getReq, this.metadata, (err, response) => {
        if (err) return reject(err);
        resolve(response);
      });
    });

    // Get the device profile from the response
    const existingProfile = (getRes as any).getDeviceProfile();

    // Update fields
    if (fields.name) existingProfile.setName(fields.name);
    if (fields.description) existingProfile.setDescription(fields.description);
    if (fields.region) {
      const regionEnum = getRegionEnum(fields.region);
      if (regionEnum !== undefined) {
        existingProfile.setRegion(regionEnum as any);
      }
    }

    const req = new UpdateDeviceProfileRequest();
    req.setDeviceProfile(existingProfile);

    await new Promise<void>((resolve, reject) => {
      this.deviceProfileClient.update(req, this.metadata, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  async deleteDeviceProfile(id: string) {
    const req = new DeleteDeviceProfileRequest();
    req.setId(id);
    await new Promise<void>((resolve, reject) => {
      this.deviceProfileClient.delete(req, this.metadata, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}
