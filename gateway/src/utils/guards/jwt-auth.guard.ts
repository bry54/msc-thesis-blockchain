import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { getRequestFromContext } from '../helpers/request-helpers';
import {ExtractJwt} from "passport-jwt";

const publicEndpoints: string[] = ['health-check', 'auth/login'];

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
      @InjectRepository(User) public usersRepo: Repository<User>
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = getRequestFromContext(context);

    if (publicEndpoints.some((path) => request.url.includes(path))) {
      return true;
    }

    const canActivate: boolean = await (super.canActivate(
      context,
    ) as Promise<boolean>);

    if (canActivate) {
      const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
      const user = await this.usersRepo.findOne({
        where: {id: request.user.id},
        relations: ['accessTokens']
      });

      const tokenExists = user.accessTokens.find(token => token.value == accessToken);
      if (!tokenExists) {
        throw new UnauthorizedException('Access token not found');
      }
    }

    return canActivate
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
