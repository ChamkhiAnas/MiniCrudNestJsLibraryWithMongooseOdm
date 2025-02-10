
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthorId = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log("data",data)
    return data
  },
);

