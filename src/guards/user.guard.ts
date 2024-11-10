import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EForbidden, EUnauth } from '../models/exception.models';
import { arrayUnique, isArrayEmpty } from '../utils/global.utils';
import {
    ClientGrpc,
  } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { PermissionsObject } from '../utils/password.utils';

export interface UserFromToken<T> {
    getUserFromToken(params: {token: string}): Observable<T>
}

abstract class _UserGuard<T extends PermissionsObject> {
    validatePermissions(user: T, permissions: string[]): boolean {
        if (!user.permissions||user.permissions.length == 0) return false;
        let allowed = false;
        permissions.forEach(permission => {
            let result = this.validatePermission(user, permission);
            if (result) allowed = true;
        })
        return allowed;
    }

    validatePermission(user: T, permission: string): boolean {
        let allowed = user.permissions.find(p => p === permission);
        if (allowed) return true;
        const levels = permission.split(".");
        const lastSegment = levels.pop();
        if (levels.length == 0) return false;
        if (lastSegment == "*") {
            levels.pop();
        }
        const _permission = [...levels, "*"].join(".");
        return this.validatePermission(user, _permission);
    }
}

@Injectable()
export class RpcUserGuard<T extends PermissionsObject> extends _UserGuard<T> implements CanActivate {
    private rpcAuthService: UserFromToken<T>;
    constructor(private reflector: Reflector, @Inject('AUTH_PACKAGE') private client: ClientGrpc) {
        super();
        this.rpcAuthService = this.client.getService<UserFromToken<T>>('AuthService');
    }

    async canActivate(context: ExecutionContext,): Promise<boolean> {
        const permissionHander = this.reflector.get<string[]>('permissions', context.getHandler())??[];
        const classPermissionHandler = this.reflector.get<string[]>('permissions', context.getClass())??[];
        const roles = arrayUnique([...classPermissionHandler, ...permissionHander]);
        if (isArrayEmpty(roles)) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        const _user = await this.getUserData(request);
        response.locals.user = _user;
        
        return this.validatePermissions(_user, roles);
    }

    async getUserData(request: Request): Promise<T> {
        const _authHeader = request.headers['authorization'];
        if (_authHeader?.startsWith("Bearer ")){
            const _token = _authHeader.substring(7, _authHeader.length);
            return await this.rpcAuthService.getUserFromToken({token: _token}).toPromise();
        } else {
            throw new EUnauth();
        }
    }
}

@Injectable()
export class UserGuard<T extends PermissionsObject> extends _UserGuard<T> implements CanActivate {
    constructor(private reflector: Reflector, @Inject('AUTH_SERVICE') private auth$: UserFromToken<T>) {
        super();
    }
    async canActivate(context: ExecutionContext,): Promise<boolean> {
        const permissionHander = this.reflector.get<string[]>('permissions', context.getHandler())??[];
        const classPermissionHandler = this.reflector.get<string[]>('permissions', context.getClass())??[];
        const roles = arrayUnique([...classPermissionHandler, ...permissionHander]);
        if (isArrayEmpty(roles)) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        const _user = await this.getUserData(request);
        response.locals.user = _user;
        
        return this.validatePermissions(_user, roles);
    }

    async getUserData(request: Request): Promise<T> {
        const _authHeader = request.headers['authorization'];
        if (_authHeader?.startsWith("Bearer ")){
            const _token = _authHeader.substring(7, _authHeader.length);
            return await this.auth$.getUserFromToken({token: _token}).toPromise();
        } else {
            throw new EUnauth();
        }
    }
}