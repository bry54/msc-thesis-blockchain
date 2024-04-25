import {ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../../modules/users/entities/user.entity";
import {Repository} from "typeorm";
import {getRequestFromContext} from "../helpers/request-helpers";

const publicEndpoints: string[] = [
    'health-check',
    'auth/login'
]

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    constructor(
        @InjectRepository(User) public usersRepo: Repository<User>) {
        super();
    }

    async canActivate(context: ExecutionContext) {

        const request = getRequestFromContext(context);

        if (publicEndpoints.some((path) => request.url.includes(path))) {
            return true;
        }

        const canActivate: boolean = await (super.canActivate(context) as Promise<boolean>);

        if (canActivate){
            return true
        }
    }

    handleRequest(err, user, info) {
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }
}
