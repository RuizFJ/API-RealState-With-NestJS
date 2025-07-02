import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';

@Module({
  controllers: [PropertiesController],
  providers: [PropertiesService],
  imports: [TypeOrmModule.forFeature([Property])], // No additional imports needed for this module
  exports: [PropertiesService], // Exporting the service to be used in other modules
})
export class PropertiesModule {}
