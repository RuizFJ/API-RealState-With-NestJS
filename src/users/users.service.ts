import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {

  constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
    ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      // Check if the email already exists
      const existingUser = await this.userRepository.findOneBy({ email: createUserDto.email });
      if (existingUser) {
        throw new ConflictException(`Email ${createUserDto.email} already exists`);
      }
      const user = await this.userRepository.create(createUserDto);
      const cretedUser = await this.userRepository.save({
        ...user,
        password: bcrypt.hashSync (createUserDto.password, 10), // Ensure password is set correctly
      });

      return {
        name: cretedUser.name,
        email: cretedUser.email,
        id: cretedUser.id,
        role: cretedUser.role,
      };
    } catch (error) {
      throw new BadRequestException(`Error creating user: ${error.message}`, error);
      
    }

  }

  async findAll() {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new BadRequestException(`Error fetching users: ${error.message}`, error);
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
      throw new BadRequestException(`Error fetching user with ID ${id}: ${error.message}`, error);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      
      const user = await this.findOne(id);
      Object.assign(user, updateUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException(`Error updating user: ${error.message}`, error);
      
    };
  }

  async remove(id: string) {
    try {
      const user = await this.findOne(id);
      await this.userRepository.remove(user);
      return { message: `User with ID ${id} removed successfully` };
    } catch (error) {
      throw new BadRequestException(`Error removing user with ID ${id}: ${error.message}`, error);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findOneBy({ email });
    } catch (error) {
      throw new BadRequestException(`Error finding user by email ${email}: ${error.message}`, error);
    }
  }
}
