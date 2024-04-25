import {Controller, Post, Request, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('auth/login')
    async login(@Request() req) {
        return req.user;
    }
}