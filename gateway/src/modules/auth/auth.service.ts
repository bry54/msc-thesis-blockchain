import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { SignInResponseDto, TokenDto } from './dto/token.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {AccessToken} from "../users/entities/access-token.entity";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly logger: PinoLogger,
    @InjectRepository(AccessToken) private tokensRepo: Repository<AccessToken>,
  ) {}

  async login(dto: SignInDto): Promise<SignInResponseDto> {
    const user = await this.usersService.findOne({
      where: { username: dto.username },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!bcrypt.compareSync(dto.password, user.password)) {
      throw new UnauthorizedException();
    }

    const payload: TokenDto = {
      username: user.username,
      sub: user.id,
      role: user.role,
      organizationId: user.stakeholderId,
    };

    const token = this.jwtService.sign(payload, {
      issuer: this.configService.get('auth.jwtIssuer'),
    });

    const exising = await this.tokensRepo.findOne({
      where: {
        userId: user.id,
        agent: dto.agent,
      },
    })

    if (exising){
      await this.tokensRepo.update({
        id: exising.id,
      }, {
        value: token
      })
    } else {
      await this.tokensRepo.save({
        userId: user.id,
        agent: dto.agent,
        value: token
      })
    }

    return {
      fullName: user.fullName,
      accessToken: token,
    };
  }

  async register(dto: User) {
    return this.usersService.createOne(null, dto);
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
