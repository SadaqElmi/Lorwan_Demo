import { ApplicationsService } from "./applications.service";
export declare class ApplicationsController {
    private readonly applicationsService;
    constructor(applicationsService: ApplicationsService);
    findAll(): Promise<{
        success: boolean;
        applications: {
            application_id: any;
            total_uplinks: any;
            device_count: any;
            last_seen: any;
            first_seen: any;
        }[];
    }>;
}
