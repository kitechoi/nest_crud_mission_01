import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ArticleModule } from './article/ArticleModule';
import { AuthModule } from './auth/AuthModule';
import { UserModule } from './user/UserModule';
import { AuthController } from './auth/presentation/AuthController';
import { AppDataSource } from './data-source'; 

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
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
