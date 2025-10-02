"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChirpstackModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const chirpstack_service_1 = require("./chirpstack.service");
const chirpstack_controller_1 = require("./chirpstack.controller");
const schemas_1 = require("../database/schemas");
let ChirpstackModule = class ChirpstackModule {
};
exports.ChirpstackModule = ChirpstackModule;
exports.ChirpstackModule = ChirpstackModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            mongoose_1.MongooseModule.forFeature([
                { name: schemas_1.TenantRef.name, schema: schemas_1.TenantRefSchema },
                { name: schemas_1.ApplicationRef.name, schema: schemas_1.ApplicationRefSchema },
                { name: schemas_1.DeviceRef.name, schema: schemas_1.DeviceRefSchema },
            ]),
        ],
        providers: [chirpstack_service_1.ChirpstackService],
        controllers: [chirpstack_controller_1.ChirpstackController],
        exports: [chirpstack_service_1.ChirpstackService],
    })
], ChirpstackModule);
//# sourceMappingURL=chirpstack.module.js.map