import { Model } from "mongoose";
import { CreateDTO, ObjectIdDTO, UpdateDTO } from "../dtos/crud.dtos";
import { EInternalError, ENotFound } from "../models/exception.models";
import { RecordModel } from "../models/timestamp.model";

export abstract class CRUDService<T extends RecordModel> {
    __model: Model<any>;
    doUpdate: Boolean = false;
    constructor(model: Model<any>) {
        this.__model = model;
    }

    async sendRealtimeUpdate(data: T) {}

    async create(dto: CreateDTO<T>): Promise<T> {
        try {
            console.log(dto);
            const record = await new this.__model(dto).save();
            return record;
        } catch (err) {
            throw new EInternalError(err);
        }
    }

    async update(dto: UpdateDTO<T>): Promise<T> {
        try {
            const record = await this.__model.findByIdAndUpdate(dto._id, dto, {new: true});
            if (this.doUpdate) {
                this.sendRealtimeUpdate(record);
            }
            return record;
        } catch (err) {
            throw new EInternalError(err);
        }
    }

    async delete(dto: ObjectIdDTO): Promise<T> {
        try {
            const record = await this.__model.findByIdAndDelete(dto.id);
            return record;
        } catch (err) {
            throw new EInternalError(err);
        }
    }
}

export abstract class RecordService<T extends RecordModel> extends CRUDService<T> {
    __model: Model<any>;
    constructor(model: Model<any>) {
        super(model);
        this.__model = model;
    }
    async findById(dto: ObjectIdDTO): Promise<T> {
        try {
            const record = await this.__model.findById(dto.id);
            if (!record) throw new ENotFound()
            return record;
        } catch (err) {
            throw new EInternalError(err);
        }
    }

    async findAll(): Promise<T[]> {
        try {
            const records = await this.__model.find();
            return records;
        } catch (err) {
            throw new EInternalError(err);
        }
    }
}
