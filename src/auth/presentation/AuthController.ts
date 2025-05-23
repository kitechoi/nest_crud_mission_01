import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Get, Logger, Req, NotFoundException, Res, UnauthorizedException } from '@nestjs/common';
import { AuthUseCase } from '../application/AuthUseCase';
import { LocalAuthGuard } from '../LocalAuthGuard';
import { JwtAuthGuard } from '../JwtAuthGuard';
import { User } from 'src/user/domain/User';
import { Request } from 'express';
import { Response as ExpressResponse } from 'express';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authUseCase: AuthUseCase) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(@Req() req: Request, @Res({ passthrough: true }) res: ExpressResponse) {
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
      this.authUseCase.setRefreshToken(req.user, res);

      const accessToken = this.authUseCase.generateAccessToken(req.user);

      return accessToken;
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw error;
    }
  }

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
