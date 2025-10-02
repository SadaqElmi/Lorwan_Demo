"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiModule = void 0;
const common_1 = require("@nestjs/common");
const chirpstack_module_1 = require("../chirpstack/chirpstack.module");
const mqtt_module_1 = require("../mqtt/mqtt.module");
const auth_module_1 = require("../auth/auth.module");
const organizations_controller_1 = require("./organizations.controller");
const applications_controller_1 = require("./applications.controller");
const devices_controller_1 = require("./devices.controller");
const downlinks_controller_1 = require("./downlinks.controller");
let ApiModule = class ApiModule {
};
exports.ApiModule = ApiModule;
exports.ApiModule = ApiModule = __decorate([
    (0, common_1.Module)({
        imports: [chirpstack_module_1.ChirpstackModule, mqtt_module_1.MqttModule, auth_module_1.AuthModule],
        controllers: [
            organizations_controller_1.OrganizationsController,
            applications_controller_1.ApplicationsController,
            devices_controller_1.DevicesController,
            downlinks_controller_1.DownlinksController,
        ],
    })
], ApiModule);
//# sourceMappingURL=api.module.js.map