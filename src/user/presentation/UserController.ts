import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Post } from '@nestjs/common';
import { CreateLoginUseCase } from '../application/CreateLoginUseCase/CreateLoginUseCase';
import { UserControllerCreateLoginRequestBody } from './UserControllerRequest';
import { config } from 'src/shared/config/config';
import { Response } from 'express';
import { parseDuration } from 'src/shared/utils/ms';
import {
  UserControllerCreateLoginResponse,
  UserControllerCreateReissuedAccessTokenResponse,
} from './UserControllerResponse';
import { Request } from 'express';
import { JwtRefreshGuard } from 'src/auth/guards/JwtRefreshGuard';
import { CreateReissuedAccessTokenUseCase } from '../application/CreateReissuedAccessTokenUseCase/CreateReissuedAccessTokenUseCase';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(
    private createLoginUseCase: CreateLoginUseCase,
    private createReissuedAccessTokenUseCase: CreateReissuedAccessTokenUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: UserControllerCreateLoginRequestBody,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserControllerCreateLoginResponse> {
    // 1. 입력받은 유저의 username, pw를 UC에서 검증한다
    // 2. 엑세스 토큰을 발급한다
    // 3. 리프레시 토큰을 발급한다
    try {
      const { ok, accessToken, refreshToken } =
        await this.createLoginUseCase.execute({
          username: body.username,
          userPassword: body.userPassword,
        });

      if (!ok) {
        throw new InternalServerErrorException();
      }

      // 4. 리프레시 토큰은 쿠키에 저장한다
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

  // 1. JwtRefreshGuard로 refresh 토큰이 유효한지 검증한다
  // 2. 리프레시 토큰이 유효하면 그 DB에 접근하여 해당 유저가 유효한지 확인한다
  // 3. accesstoken 발급한다
  // CreateAccessTokenByRefreshTokenUseCase
  // CreateReissuedAccessTokenUseCase
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  async refreshAccessToken(
    @Req() request: Request,
  ): Promise<UserControllerCreateReissuedAccessTokenResponse> {
    try {
      if (!request.user) {
        throw new UnauthorizedException();
      }
      const { id } = request.user;

      const { accessToken } =
        await this.createReissuedAccessTokenUseCase.execute({ id: id });

      return {
        accessToken: accessToken,
      };
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw error;
    }
  }
}
