import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userRepository.findOneBy({
        email: createUserDto.email,
      });

      if (existingUser) {
        throw new ConflictException(
          `Email ${createUserDto.email} already exists`,
        );
      }

      const user = this.userRepository.create({
        ...createUserDto,
        password: createUserDto.password
          ? bcrypt.hashSync(createUserDto.password, 10) // Hash the password if provided
          : undefined, // si viene por Google no pone nada
      });

      const createdUser = await this.userRepository.save(user);

      return {
        name: createdUser.name,
        email: createdUser.email,
        id: createdUser.id,
        role: createdUser.role,
      };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email already exists');
      }
      throw new BadRequestException(
        `Error creating user: ${error.message}`,
        error,
      );
    }
  }

  async findAll() {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new BadRequestException(
        `Error fetching users: ${error.message}`,
        error,
      );
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepository.findOneBy({ id: id });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      throw new BadRequestException(
        `Error fetching user with ID ${id}: ${error.message}`,
        error,
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.findOne(id);
      Object.assign(user, updateUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException(
        `Error updating user: ${error.message}`,
        error,
      );
    }
  }

  async remove(id: string) {
    try {
      const user = await this.findOne(id);
      await this.userRepository.remove(user);
      return { message: `User with ID ${id} removed successfully` };
    } catch (error) {
      throw new BadRequestException(
        `Error removing user with ID ${id}: ${error.message}`,
        error,
      );
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findOneBy({ email });
    } catch (error) {
      throw new BadRequestException(
        `Error finding user by email ${email}: ${error.message}`,
        error,
      );
    }
  }

  async findByEmailWithPass(email: string) {
    try {
      const user = this.userRepository.findOne({
        where: { email },
        select: {
          id: true,
          email: true,
          password: true,
          role: true,
          provider: true,
        },
      });

      return user;
    } catch (error) {
      throw new BadRequestException(
        `Error finding user by email ${email}: ${error.message}`,
        error,
      );
    }
  }

  async findById(id: string) {
    try {
      const user = this.userRepository.findOne({
        where: { id },
        select: {
          id: true,
          email: true,
          role: true,
          refreshToken: true
        },
      });

      return user;
    } catch (error) {
      throw new BadRequestException(
        `Error finding user by id ${id}: ${error.message}`,
        error,
      );
    }
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }
}
