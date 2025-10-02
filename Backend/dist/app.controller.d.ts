import { AppService } from "./app.service";
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getTest(): {
        success: boolean;
        message: string;
        timestamp: string;
        framework: string;
    };
}
