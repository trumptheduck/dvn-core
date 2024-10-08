import { createParamDecorator, ExecutionContext } from '@nestjs/common';
/**
 * Delete unused fields from request body
 * @param {string[]} stripFields An array of field keys as string to remove
 */
export const Stripped = createParamDecorator(
  (stripFields: string[] = [], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    let body = request.body;
    stripFields.forEach(field => {
        body[field] = undefined;
    })
    return body;
  },
);