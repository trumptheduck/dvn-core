import { HttpException, HttpStatus } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { GrpcInternalException, GrpcInvalidArgumentException, GrpcNotFoundException, GrpcUnauthenticatedException } from "nestjs-grpc-exceptions";

/**
 * ApiException provides an easy way to handle Rpc and Http exceptions at the same time
 * @param {http} HttpException Http exception to be handled
 * @param {rpc} RpcException RPC exception to be handled
 */

export class ApiException {
    constructor(public http: HttpException, public rpc: RpcException) {}
}

export class EForbidden extends ApiException {
    constructor(message: string = "Bạn không có quyền truy cập tài nguyên này!") {
        super(new HttpException(message, HttpStatus.FORBIDDEN), new GrpcUnauthenticatedException(message));
    }
}

export class EInternalError extends ApiException {
    constructor(message: string = "Lỗi máy chủ!", trace?: any) {
        super(new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR), new GrpcInternalException(message));
        if (trace.status) {
            throw trace;
        }
    }
}

export class EUnauth extends ApiException {
    constructor(message: string = "Tài nguyên yêu cầu Authorization!") {
        super(new HttpException(message, HttpStatus.UNAUTHORIZED), new GrpcUnauthenticatedException(message));
    }
}

export class EBadRequest extends ApiException {
    constructor(message: string = "Request không hợp lệ!") {
        super(new HttpException(message, HttpStatus.BAD_REQUEST), new GrpcInvalidArgumentException(message));
    }
}

export class ENotFound extends ApiException {
    constructor(message: string = "Tài nguyên không tồn tại!") {
        super(new HttpException(message, HttpStatus.NOT_FOUND), new GrpcNotFoundException(message));
    }
}
export class EUnprocessableEntity extends ApiException {
    constructor(message: string = "Dữ liệu gửi không hợp lệ!") {
        super(new HttpException(message, HttpStatus.UNPROCESSABLE_ENTITY), new GrpcInvalidArgumentException(message));
    }
    
    static query(...queries: string[]) {
        return new EUnprocessableEntity("Thiếu query " + queries.join(", "))
    }
    static field(...fields: string[]) {
        return new EUnprocessableEntity("Thiếu field " + fields.join(", "))
    }
}