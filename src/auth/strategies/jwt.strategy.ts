import { PassportStrategy } from '@nestjs/passport';
import { PayloadInterface } from '../interfaces/payload.interface';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UnauthorizedException } from '@nestjs/common';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ){
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: PayloadInterface): Promise<User> {

    const {sub} = payload;

    const user = await this.userRepository.findOne({
        where: {
            id: sub
        }
    });

    if(!user){
         throw new UnauthorizedException('Token not valid')
    }
    if(!user.is_active){
        throw new UnauthorizedException('Token not valid')
    }

    return user;
  }
}
