import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpLocalDto } from './dto/sign-up-local.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { AuthenticationStatus } from 'src/common/enums/provider-authentication.enum';
import { access } from 'fs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async registerLocal(signUpLocalDto: SignUpLocalDto) {
    try {
      // Check if the email already exists
      const existingUser = await this.usersService.findByEmail(
        signUpLocalDto.email,
      );
      if (existingUser) {
        if (existingUser?.provider === AuthenticationStatus.GOOGLE) {
          throw new UnauthorizedException(
            `Email ${signUpLocalDto.email} is already registered with Google. Please use Google login.`,
          );
        }
        throw new ConflictException(
          `Email ${signUpLocalDto.email} already exists`,
        );
      }

      const userdata = await this.usersService.create(signUpLocalDto);

      if (!userdata) {
        throw new BadRequestException('Error creating user');
      }
      const accessToken = this.generateJwt(userdata);

      return {
        user: {
          id: userdata.id,
          name: userdata.name,
          email: userdata.email,
          role: userdata.role,
        },
        accessToken,
      };
    } catch (error) {
      throw new BadRequestException(
        `Error creating user: ${error.message}`,
        error,
      );
    }
  }

  async handleGoogleLogin(userFromGoogle: any) {
    const user = await this.usersService.findByEmail(userFromGoogle.email);

    if (!user) {
      const newUser = await this.usersService.create({
        email: userFromGoogle.email,
        name: userFromGoogle.name,
        lastName: userFromGoogle.lastName,
        googleId: userFromGoogle.googleId,
        provider: AuthenticationStatus.GOOGLE,
      });
      return this.generateJwt(newUser);
    }
    if (user.provider === AuthenticationStatus.LOCAL) {
      throw new UnauthorizedException(
        `Email ${userFromGoogle.email} is already registered with local authentication. Please use local login.`,
      );
    }
    const accessToken = this.generateJwt(user);
    return {accessToken};
  }

  private generateJwt(user){
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload);
    if (!accessToken) {
      throw new BadRequestException('Error generating access token');
    }
    return accessToken;
  }
}
