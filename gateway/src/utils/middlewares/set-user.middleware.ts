import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestContext } from 'nestjs-request-context';

@Injectable()
export class SetUserMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        // Assuming the user information is stored in req.user after authentication
        const ctx = RequestContext.currentContext;
        ctx.req.user = req.user;

        console.log(ctx.req.user)
        next();
    }
}
