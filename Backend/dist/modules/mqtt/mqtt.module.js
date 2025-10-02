"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mqtt_service_1 = require("./mqtt.service");
const database_module_1 = require("../database/database.module");
const schemas_1 = require("../database/schemas");
let MqttModule = class MqttModule {
};
exports.MqttModule = MqttModule;
exports.MqttModule = MqttModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            mongoose_1.MongooseModule.forFeature([
                { name: schemas_1.Uplink.name, schema: schemas_1.UplinkSchema },
                { name: schemas_1.Downlink.name, schema: schemas_1.DownlinkSchema },
            ]),
        ],
        providers: [mqtt_service_1.MqttService],
        exports: [mqtt_service_1.MqttService],
    })
], MqttModule);
//# sourceMappingURL=mqtt.module.js.map