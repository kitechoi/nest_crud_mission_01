import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Get, Logger, Req, NotFoundException } from '@nestjs/common';
import { AuthUseCase } from '../application/AuthUseCase';
import { LocalAuthGuard } from '../LocalAuthGuard';
import { JwtAuthGuard } from '../JwtAuthGuard';
import { User } from 'src/user/domain/User';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authUseCase: AuthUseCase) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(@Req() req: Request) {
    try {
      if (!req.user) {
        throw new NotFoundException();
      }
      if (!(req.user instanceof User)) {
        throw new NotFoundException();
      }
      const accessToken = this.authUseCase.login(req.user);
      return accessToken;
      
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return req.user;
  }
}
