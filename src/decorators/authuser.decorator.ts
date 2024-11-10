import { createParamDecorator, ExecutionContext } from '@nestjs/common';
/**
 * Require and returns authenticated user
 */
export const AuthUser = createParamDecorator(
  (stripFields: string[] = [], ctx: ExecutionContext) => {
    const response = ctx.switchToHttp().getResponse();
    return (response.locals.user)??null;
  },
);