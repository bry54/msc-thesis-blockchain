import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { CrudOptions } from '@dataui/crud';

export function getRequestFromContext(context: ExecutionContext) {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest();
  } else if (context.getType() === 'ws') {
    return context.switchToWs().getClient();
  }
}

export const crudGeneralOptions: Partial<CrudOptions> = {
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  query: {
    maxLimit: 100,
    softDelete: true,
    alwaysPaginate: true,
    sort: [
      { field: 'updatedDate', order: 'DESC'}
    ],
    exclude: ['password', 'accessToken'],
  },
};

export const AuthUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      return request.user;
    },
);
