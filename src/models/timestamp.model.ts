export abstract class RecordModel {
    _id: string;
    owner?: string;
}

export abstract class TimestampModel extends RecordModel {
    createdAt: Date
    updatedAt: Date
}