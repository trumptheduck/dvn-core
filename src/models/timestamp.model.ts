export abstract class _BaseRecordModel {
    _id: string;
    owner?: string;
}

export abstract class TimestampModel extends _BaseRecordModel {
    createdAt: Date
    updatedAt: Date
}