import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configs/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { loggerParams } from './configs/logger.config';
import {AuthModule} from "./modules/auth/auth.module";
import {APP_GUARD} from "@nestjs/core";
import {JwtAuthGuard} from "./utils/guards/jwt-auth.guard";
import {JwtStrategy} from "./modules/auth/strategies/jwt.strategy";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'mariadb',
                host: configService.get('database.host'),
                port: +configService.get('database.port'),
                username: configService.get('database.username'),
                password: configService.get('database.password'),
                database: configService.get('database.schema'),
                entities: ['dist/**/*.entity{.ts,.js}'],
                synchronize: true,
            }),
            inject: [ConfigService],
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env.development'],
            load: [configuration],
        }),
        LoggerModule.forRoot(loggerParams),
        AuthModule,
        UsersModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
