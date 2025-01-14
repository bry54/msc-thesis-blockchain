import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UsersModule} from './modules/users/users.module';
import {ConfigModule, ConfigService} from '@nestjs/config';
import configuration from './configs/configuration';
import {TypeOrmModule} from '@nestjs/typeorm';
import {LoggerModule} from 'nestjs-pino';
import {loggerParams} from './configs/logger.config';
import {AuthModule} from './modules/auth/auth.module';
import {FabricModule} from './modules/fabric/fabric.module';
import {StakeholderModule} from './modules/stakeholder/stakeholder.module';
import {SnakeNamingStrategy} from 'typeorm-naming-strategies';
import {ProductionModule} from './modules/production/production.module';
import {CrudUserAppendInterceptor} from "./utils/interceptors/user-interceptor.service";
import {APP_GUARD, APP_INTERCEPTOR} from '@nestjs/core';
import {JwtAuthGuard} from "./utils/guards/jwt-auth.guard";
import {User} from "./modules/users/entities/user.entity";

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
        namingStrategy: new SnakeNamingStrategy(),
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
    TypeOrmModule.forFeature([User]),
    FabricModule,
    AuthModule,
    UsersModule,
    StakeholderModule,
    ProductionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CrudUserAppendInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }
  ],
})
export class AppModule {}
