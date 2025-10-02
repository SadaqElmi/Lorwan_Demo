export interface UplinkMessage {
  device_id: string;
  application_id: string;
  f_port: number;
  f_cnt: number;
  frm_payload?: string;
  decoded_payload?: any;
  rx_info?: any[];
  tx_info?: any;
}

export interface ChirpStackEvent {
  object: {
    uplink_message: UplinkMessage;
  };
}

export interface ParsedPayload {
  decoded_payload?: any;
  raw_payload?: string;
  decoded_raw?: string;
  metadata?: {
    device_id: string;
    application_id: string;
    f_port: number;
    f_cnt: number;
    rx_info: any[];
    tx_info: any;
  };
  _parsed_at: Date;
  _topic: string;
  _format: string;
  raw_hex?: string;
  raw_base64?: string;
  decoded_hex?: string;
  decoded_text?: string;
  raw?: string;
  _error?: string;
}

export interface UplinkDocument {
  topic: string;
  payload: ParsedPayload;
  ts: Date;
  device_id: string;
  application_id: string;
}
