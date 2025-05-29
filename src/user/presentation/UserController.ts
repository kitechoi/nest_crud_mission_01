import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Res,
} from '@nestjs/common';
import { Post } from '@nestjs/common';
import { CreateTokenByUserUseCase } from '../application/CreateTokenByUserUseCase/CreateTokenByUserUseCase';
import { UserControllerCreateTokenByUserRequestBody } from './UserControllerRequest';
import { config } from 'src/shared/config/config';
import { Response } from 'express';
import { parseDuration } from 'src/shared/utils/ms';
import { UserControllerCreateTokenByUserResponse } from './UserControllerResponse';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private createTokenByUserUseCase: CreateTokenByUserUseCase) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() body: UserControllerCreateTokenByUserRequestBody,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserControllerCreateTokenByUserResponse> {
    // 입력받은 유저의 id, pw를 UC에서 검증한다. => 토큰 발급 시 공통로직
    // 엑세스 토큰을 발급한다.
    // 리프레시 토큰을 발급한다 => 엑세스 토큰 발급과 분리하지 않아도 되나.
    try {
      const { ok, accessToken, refreshToken } =
        await this.createTokenByUserUseCase.execute({
          username: body.username,
          userPassword: body.userPassword,
        });

      if (!ok) {
        throw new InternalServerErrorException();
      }

      // 리프레시 토큰은 쿠키에 저장해준다
      response.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        maxAge: parseDuration(config.JWT_REFRESH_EXPIRES_IN),
      });

      return {
        accessToken: accessToken,
      };

    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw error;
    }
  }
}
