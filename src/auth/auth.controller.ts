import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpLocalDto } from './dto/sign-up-local.dto';
import { GoogleAuthGuard } from './guards/googleAuth.guard';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up-local')
  create(@Body() signUpDto: SignUpLocalDto) {
    return this.authService.registerLocal(signUpDto);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  async verifyToken() {
    return { ms: 'ok' };
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async register(@Req() req) {
    return this.authService.handleGoogleLogin(req.user);
  }

  @Post('login-local')
  loginUser(@Body() loginDto: LoginDto) {
    return this.authService.handleLocalLogin(loginDto);
  }

  @Post('refresh-token')
  refresh(@Body('refreshToken') token: string) {
    return this.authService.rotateRefreshToken(token);
  }
}
