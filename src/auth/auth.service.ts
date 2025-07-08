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
import { AuthenticationStatus } from 'src/common/enums/provider-authentication.enum';
import { LoginDto } from './dto/login.dto';
import { IsStrongPassword } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';

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
      const refreshToken = this.generateRefreshTok(userdata);
      await this.usersService.updateRefreshToken(userdata.id, refreshToken);

      return {
        user: {
          id: userdata.id,
          name: userdata.name,
          email: userdata.email,
          role: userdata.role,
        },
        accessToken,
        refreshToken,
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
    let refreshToken: string = '';

    if (!user) {
      const newUser = await this.usersService.create({
        email: userFromGoogle.email,
        name: userFromGoogle.name,
        lastName: userFromGoogle.lastName,
        googleId: userFromGoogle.googleId,
        provider: AuthenticationStatus.GOOGLE,
      });
      refreshToken = this.generateRefreshTok(newUser);
      await this.usersService.updateRefreshToken(newUser.id, refreshToken);
      return { accessToken: this.generateJwt(newUser), refreshToken };
    }
    if (user.provider === AuthenticationStatus.LOCAL) {
      throw new UnauthorizedException(
        `Email ${userFromGoogle.email} is already registered with local authentication. Please use local login.`,
      );
    }
    const accessToken = this.generateJwt(user);
    return {
      accessToken: accessToken,
      RefreshToken: this.generateRefreshTok(user),
    };
  }

  async handleLocalLogin(loginDto: LoginDto) {
    const user = await this.usersService.findByEmailWithPass(loginDto.email);
    const { password } = loginDto;

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (user.provider !== AuthenticationStatus.LOCAL) {
      throw new BadRequestException('This User cannot login');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const refreshToken = this.generateRefreshTok(user);
    await this.usersService.updateRefreshToken(user.id, refreshToken);
    return {
      accesToken: this.generateJwt(user),
      refreshToken: refreshToken
    };
  }

  private generateJwt(user) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    if (!accessToken) {
      throw new BadRequestException('Error generating access token');
    }
    return accessToken;
  }

  private generateRefreshTok(user) {
    const payload = {
      sub: user.id,
      email: user.email,
    };
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
    if (!refreshToken) {
      throw new BadRequestException('Error generating access token');
    }
    return refreshToken;
  }

  async rotateRefreshToken(refreshT: string) {

    try{

    const payload = this.jwtService.verify(refreshT, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    const user = await this.usersService.findById(payload.sub);

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Refresh token not found');
      }

    const isMatch = await bcrypt.compare(refreshT, user.refreshToken);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid refresh token');
      }

    const newPayload = { sub: user.id, email: user.email, role: user.role };

      const newAccessToken = this.jwtService.sign(newPayload, {
        expiresIn: '15m',
      });

      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      });

       await this.usersService.updateRefreshToken(user.id, newRefreshToken);

       return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };

    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Refresh token expired');
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

 
}
