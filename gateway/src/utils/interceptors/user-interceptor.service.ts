import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { getAction } from '@dataui/crud';
import {BaseEntity} from "../helpers/base.entity";

enum CrudActions {
  ReadAll = 'Read-All',
  ReadOne = 'Read-One',
  CreateOne = 'Create-One',
  CreateMany = 'Create-Many',
  UpdateOne = 'Update-One',
  ReplaceOne = 'Replace-One',
  DeleteOne = 'Delete-One'
}

@Injectable()
export class CrudUserAppendInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();

    const action = getAction(handler);
    const body: BaseEntity = request.body;
    const authenticated = request.user;

    if (authenticated){
      switch (action) {
        case CrudActions.CreateOne:
          body.createdBy = authenticated.userId
          body.updatedBy = authenticated.userId
          break;
        case CrudActions.DeleteOne:
          body.deletedBy = authenticated.userId
          break;
        default:
          body.updatedBy = authenticated.userId;
      }
    }

    return next.handle();
  }
}

@Injectable()
export class CustomUserAppendInterceptor {
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
