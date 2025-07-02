import { Module } from '@nestjs/common';
import { AgentRequestService } from './agent-request.service';
import { AgentRequestController } from './agent-request.controller';
import { AgentRequest } from './entities/agent-request.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { User } from 'src/users/entities/user.entity';

@Module({

  imports: [TypeOrmModule.forFeature([AgentRequest, User]), UsersModule], // No additional imports needed for this module
  controllers: [AgentRequestController],
  providers: [AgentRequestService],

})
export class AgentRequestModule {}
