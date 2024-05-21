import {Body, Controller, Post, Request, UseInterceptors} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/sign-in.dto';
import { User } from "../users/entities/user.entity";
import { CrudRequestInterceptor } from "@dataui/crud";

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: SignInDto) {
    return this.authService.login(dto);
  }

  @Post('register')
  @UseInterceptors(new CrudRequestInterceptor())
  async register(@Body() dto: User) {
    return this.authService.register(dto);
  }
}
