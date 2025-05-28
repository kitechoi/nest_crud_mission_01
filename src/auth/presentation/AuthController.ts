import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Get,
  Logger,
  Req,
  NotFoundException,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthUseCase } from '../application/AuthUseCase';
import { LocalAuthGuard } from '../guards/LocalAuthGuard';
import { JwtAuthGuard } from '../guards/JwtAuthGuard';
import { User } from 'src/user/domain/User';
import { Request } from 'express';
import { Response as ExpressResponse } from 'express';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authUseCase: AuthUseCase) {}

  // auth/sigin 에서 필요한 동작
  // 1. 받은 username, password DB와 매핑하여 유효한 유저인지 검증
  // 2. 로그인 성공 -> accesstoken 발급, refreshtoken 발급

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(
    @Req() req: Request,
    @Res({ passthrough: true }) res: ExpressResponse,
  ) {
    try {
      if (!req.user) {
        throw new NotFoundException();
      }
      if (!(req.user instanceof User)) {
        throw new NotFoundException();
      }
      if (!res) {
        throw new NotFoundException();
      }
      const refreshtoken = this.authUseCase.setRefreshToken(req.user, res);
      const accessToken = req.user.issueJWTAccessToken();
      return accessToken;
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw error;
    }
  }

  // auth/refresh 에서 필요한 동작
  // 1. refresh 토큰이 유효한지 검증 -> 유효하면 그 유저 정보도 유효한지 확인
  // 2. 성공 -> accesstoken 발급

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request): Promise<{ accessToken: string }> {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('리프레시토큰 없음');
    }

    return await this.authUseCase.reissueAccessTokenByRefreshToken(
      refreshToken,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
