import { BadRequestException, Injectable } from '@nestjs/common';
import { signUpLocalDto } from './dto/sign-up-local.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpWithGoogleDto } from './dto/sign-up-with-google.dto';


@Injectable()
export class AuthService {
  constructor(private readonly usersService:UsersService, private readonly jwtService: JwtService,) {}

  async registerLocal(signUpLocalDto: signUpLocalDto) {

    try {
      const userdata = await this.usersService.create(signUpLocalDto);

      const payload = {
        sub: userdata.id,
        email: userdata.email,
        role: userdata.role,
      };
      
      const accessToken = this.jwtService.sign(payload);
      if(!accessToken) {
        throw new BadRequestException('Error generating access token');
      }

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
      throw new BadRequestException(`Error creating user: ${error.message}`, error);
    }
        

  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
