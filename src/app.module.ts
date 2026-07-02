import { modules } from './modules';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { config } from './config/config.env';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ...modules,
      JwtModule.register({
        global:true,
        secret:process.env.accessSecret,
        signOptions:{
          expiresIn:config.accessTime as any
        }
    }),
    RedisModule.forRoot({
      type:"single",
      url:config.redisUrl as string
    })
  ]
})
export class AppModule { }
