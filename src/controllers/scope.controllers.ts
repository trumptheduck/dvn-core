import { CreateDTO, ObjectIdDTO, UpdateDTO } from "../dtos/crud.dtos";
import { CRUDService, RecordService } from "../services/scope.services";
import { Get, Query, Post, Patch, Delete } from "@nestjs/common";
import { RecordModel } from "../models/timestamp.model";
import { Stripped } from "../decorators/stripped.decorator";
import { RabbitMQService } from "../services/rabbitmq.service";

export abstract class CRUDController<T extends RecordModel> {
    __service: CRUDService<T>;
    constructor(service: CRUDService<T>, protected mq: RabbitMQService, protected namespace: string) {
        this.__service = service;
        this.registerRPCs();
    }

    registerRPCs() {
        this.mq.registerRPC([this.namespace, "create"].join("."), this.__service.create);
        this.mq.registerRPC([this.namespace, "update"].join("."), this.__service.update);
        this.mq.registerRPC([this.namespace, "delete"].join("."), this.__service.delete);
    }

    @Post('')
    async create(@Stripped(['_id']) dto: CreateDTO<T>): Promise<T> {
        return await this.__service.create(dto)
    }
    @Patch('')
    async update(@Stripped(['createdAt', 'updatedAt']) dto: UpdateDTO<T>): Promise<T> {
        return await this.__service.update(dto)
    }
    @Delete('')
    async delete(@Query() dto: ObjectIdDTO): Promise<T> {
        return await this.__service.delete(dto)
    }
}

export abstract class RecordController<T extends RecordModel> extends CRUDController<T> {
    __service: RecordService<T>;
    constructor(service: RecordService<T>, mq: RabbitMQService, namespace: string) {
        super(service, mq, namespace);
        this.__service = service;
    }

    override registerRPCs(): void {
        this.mq.registerRPC([this.namespace, "findById"].join("."), this.__service.findById);
        this.mq.registerRPC([this.namespace, "findAll"].join("."), this.__service.findAll);
        super.registerRPCs();
    }

    @Get('id')
    async findById(@Query() dto: ObjectIdDTO): Promise<T> {
        return await this.__service.findById(dto)
    }
    @Get('all')
    async findAll(): Promise<T[]> {
        return await this.__service.findAll()
    }
}