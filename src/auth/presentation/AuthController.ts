import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Get, Req, Logger } from '@nestjs/common';
import { AuthUseCase } from '../application/AuthUseCase';
import { AuthGuard } from '../AuthGuard';
import { AuthControllerRequestBody } from './AuthRequest';


@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authUseCase: AuthUseCase) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() body: AuthControllerRequestBody) {

    try {
      const result = this.authUseCase.signIn({
        userId: body.userId,
        userPassword: body.userPassword,
      });

      return result;
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return req.user;
  }
}
