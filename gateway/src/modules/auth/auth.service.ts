import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {}

  async login(dto: SignInDto) {
    const user = await this.usersService.findOne({ where: {username: dto.username} });
    if ( !user ){
      throw new UnauthorizedException('User not found');
    }
    console.log(dto, user);
    if (!bcrypt.compareSync(dto.password, user.password)) {
      throw new UnauthorizedException();
    }

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, {
        issuer: this.configService.get('auth.jwtIssuer'),
      }),
    };
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.repo.findOne({
      where: { username },
    });
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
