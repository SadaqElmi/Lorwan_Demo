export declare class CreateDeviceDto {
    device_id: string;
    application_id: string;
    payload_template?: any;
}
export declare class GetUplinksDto {
    limit?: number;
    device_id?: string;
    application_id?: string;
    format?: string;
    start_date?: string;
    end_date?: string;
}
export declare class GetDeviceUplinksDto {
    limit?: number;
}
