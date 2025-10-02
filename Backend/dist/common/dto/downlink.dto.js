"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDownlinksDto = exports.SendDownlinkDto = exports.CreateDownlinkDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateDownlinkDto {
    constructor() {
        this.confirmed = false;
    }
}
exports.CreateDownlinkDto = CreateDownlinkDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDownlinkDto.prototype, "device_eui", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDownlinkDto.prototype, "application_id", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(223),
    __metadata("design:type", Number)
], CreateDownlinkDto.prototype, "f_port", void 0);
__decorate([
    (0, class_validator_1.IsBase64)(),
    __metadata("design:type", String)
], CreateDownlinkDto.prototype, "data", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDownlinkDto.prototype, "confirmed", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateDownlinkDto.prototype, "metadata", void 0);
class SendDownlinkDto {
    constructor() {
        this.confirmed = false;
    }
}
exports.SendDownlinkDto = SendDownlinkDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendDownlinkDto.prototype, "device_eui", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendDownlinkDto.prototype, "application_id", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(223),
    __metadata("design:type", Number)
], SendDownlinkDto.prototype, "f_port", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendDownlinkDto.prototype, "payload", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SendDownlinkDto.prototype, "confirmed", void 0);
class GetDownlinksDto {
    constructor() {
        this.limit = 50;
    }
}
exports.GetDownlinksDto = GetDownlinksDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetDownlinksDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetDownlinksDto.prototype, "device_eui", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetDownlinksDto.prototype, "application_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetDownlinksDto.prototype, "status", void 0);
//# sourceMappingURL=downlink.dto.js.map