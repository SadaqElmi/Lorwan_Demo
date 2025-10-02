import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return "Hello from NestJS backend 🚀";
  }

  getTest() {
    return {
      success: true,
      message: "Server is working",
      timestamp: new Date().toISOString(),
      framework: "NestJS",
    };
  }
}
