export declare class CreateDownlinkDto {
    device_eui: string;
    application_id: string;
    f_port: number;
    data: string;
    confirmed?: boolean;
    metadata?: any;
}
export declare class SendDownlinkDto {
    device_eui: string;
    application_id: string;
    f_port: number;
    payload: string;
    confirmed?: boolean;
}
export declare class GetDownlinksDto {
    limit?: number;
    device_eui?: string;
    application_id?: string;
    status?: string;
}
