import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ArticleModule } from './article/ArticleModule';
import { AuthModule } from './auth/AuthModule';
import { UserModule } from './user/UserModule';
import { AuthController } from './auth/presentation/AuthController';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT ?? '3307', 10),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [__dirname + '/**/entity/*Entity{.ts,.js}'],
      synchronize: true,
    }),
    ArticleModule,
    AuthModule,
    UserModule,
  ],
  controllers: [
    AppController,
    AuthController,
  ],
  providers: [AppService],
})
export class AppModule { }
