import { CreateDTO, ObjectIdDTO, UpdateDTO } from "../dtos/crud.dtos";
import { CRUDService, RecordService } from "../services/scope.services";
import { Get, Query, Post, Patch, Delete } from "@nestjs/common";
import { _BaseRecordModel } from "../models/timestamp.model";
import { Stripped } from "../decorators/stripped.decorator";

export abstract class CRUDController<T extends _BaseRecordModel> {
    __service: CRUDService<T>;
    constructor(service: CRUDService<T>) {
        this.__service = service;
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

export abstract class RecordController<T extends _BaseRecordModel> extends CRUDController<T> {
    __service: RecordService<T>;
    constructor(service: RecordService<T>) {
        super(service);
        this.__service = service;
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