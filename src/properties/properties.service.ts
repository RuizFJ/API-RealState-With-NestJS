import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property } from './entities/property.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PropertiesService {
  // Aquí puedes inyectar repositorios o servicios adicionales si es necesario
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}


  async create(createPropertyDto: CreatePropertyDto) {
    try {
      const property = this.propertyRepository.create(createPropertyDto);
      console.log('Creating property:', property);
      return await this.propertyRepository.save(property);

    } catch (error) {
      throw new BadRequestException(`Error creating property: ${error.message}`, error);
    }
  }

  async findAll() {
    
    try {
      return await this.propertyRepository.find();
    } catch (error) {
      throw new BadRequestException(`Error fetching properties: ${error.message}`, error);
    }
  }

  async findOne(id: string) {
    try {
      const property = await this.propertyRepository.findOneBy({ id: id });
      if (!property) {
        throw new NotFoundException(`Property with ID ${id} not found`);
      }
      return property;
    } catch (error) {
      throw new BadRequestException(`Error fetching property with ID ${id}: ${error.message}`, error);
    }
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto) {
    try {
      const property = await this.findOne(id);
      
      Object.assign(property, updatePropertyDto);
      await this.propertyRepository.save(property);
      return property;
    } catch (error) {
      throw new BadRequestException(`Error updating property: ${error.message}`, error);
    }
  }

  async remove(id: string) {
    try {
      const property = await this.findOne(id);
      await this.propertyRepository.remove(property);
      return { message: `Property with ID ${id} removed successfully` };
    } catch (error) {
      throw new BadRequestException(`Error removing property with ID ${id}: ${error.message}`, error);
    }
  }
}
