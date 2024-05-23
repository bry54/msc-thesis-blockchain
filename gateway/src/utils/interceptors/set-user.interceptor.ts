import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { getAction } from '@dataui/crud';

@Injectable()
export class SetUserInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();

    const action = getAction(handler);
    const body = request.body;

    if (request.method == 'GET') {
      console.log('We wont append anything');
    } else {
      console.log('We will append something');
    }

    return next.handle();
  }
}
