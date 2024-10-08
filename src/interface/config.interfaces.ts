export interface CRUDControllerConfig {
    post?: string,
    patch?: string,
    delete?: string
}

export interface RecordControllerConfig extends CRUDControllerConfig {
    getById?: string,
    getAll?: string
}