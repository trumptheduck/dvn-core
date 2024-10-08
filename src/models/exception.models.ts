import { HttpException, HttpStatus } from "@nestjs/common";

/**
 * ApiException wrap around HttpException for ease of use
 * @param {HttpStatus} status StatusCode of the error
 * @param {string} message Error message to send to client
 * @param {string} [trace] Error stacktrace
 */

export class ApiException extends HttpException {
    constructor(status: HttpStatus, message:string, trace?: any) {
        console.log(trace);
        if (trace) {
            super({
                status: status,
                error: message,
                stackTrace: trace
            }, status)
        } else {
            super({
                status: status,
                error: message,
            }, status)
        }
    }
}

export class EForbidden extends ApiException {
    constructor(trace?: any, message: string = "Bạn không có quyền truy cập tài nguyên này!") {
        super(HttpStatus.FORBIDDEN, message, trace)
    }
}

export class EInternalError extends ApiException {
    constructor(trace?: any, message: string = "Lỗi máy chủ!") {
        super(HttpStatus.INTERNAL_SERVER_ERROR, message, trace)
        if (trace.status) {
            throw trace;
        }
    }
}

export class EUnauth extends ApiException {
    constructor(trace?: any, message: string = "Tài nguyên yêu cầu Authorization!") {
        super(HttpStatus.UNAUTHORIZED, message, trace)
    }
}

export class EBadRequest extends ApiException {
    constructor(trace?: any, message: string = "Request không hợp lệ!") {
        super(HttpStatus.BAD_REQUEST, message, trace)
    }
}

export class ENotFound extends ApiException {
    constructor(trace?: any, message: string = "Tài nguyên không tồn tại!") {
        super(HttpStatus.NOT_FOUND, message, trace)
    }
}
export class EUnprocessableEntity extends ApiException {
    constructor(trace?: any,reason?: string, message: string = "Dữ liệu gửi không hợp lệ!") {
        super(HttpStatus.UNPROCESSABLE_ENTITY, message+ "( "+ reason+" )", trace)
    }
    
    static query(...queries: string[]) {
        return new EUnprocessableEntity(undefined, "Thiếu query " + queries.join(", "))
    }
    static field(...queries: string[]) {
        return new EUnprocessableEntity(undefined, "Thiếu field " + queries.join(", "))
    }
}