import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateAgentRequestDto } from './dto/create-agent-request.dto';
import { Repository } from 'typeorm';
import { AgentRequest } from './entities/agent-request.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/common/enums/user-role.enum';
import { AgentRequestStatus } from 'src/common/enums/agent-request-status.enum';


@Injectable()
export class AgentRequestService {
  constructor(
    @InjectRepository(AgentRequest)
    private readonly agentReqRepository: Repository<AgentRequest>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(userId: string, createAgentRequestDto: CreateAgentRequestDto) {
    try {
      const user = await this.userRepo.findOne({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const existingReq = await this.agentReqRepository.findOne({
        where: { user: { id: userId } },
      });

      if (existingReq) {
        throw new NotFoundException('You already have a pending request');
      }

      await this.agentReqRepository.create({
        ...createAgentRequestDto,
        user: user, // Associate the request with the user
        status: AgentRequestStatus.PENDING, // Default status
      });

      return this.agentReqRepository.save(createAgentRequestDto);
    } catch (error) {
      throw new BadRequestException(
        'Error creating agent request: ' + error.message,
      );
    }
  }

  async findAllPending() {
    try {
      const request = await this.agentReqRepository.find({
        where: { status: AgentRequestStatus.PENDING }, // Only return pending requests
        order: { created_at: 'DESC' }, // Order by creation date
        relations: ['user'], // Include user relation
      });
      if (!request || request.length === 0) {
        throw new NotFoundException('No pending requests found');
      }
      return request;
    } catch (error) {
      throw new BadRequestException(
        'Error fetching pending requests: ' + error.message,
      );
    }
  }

  async findOne(id: string) {
    try {
      const request = await this.agentReqRepository.findOne({
        where: { id },
        relations: ['user'], // Include user relation
      });
      if (!request) {
        throw new NotFoundException(`Agent request with ID ${id} not found`);
      }
      return request;
    } catch (error) {
      throw new BadRequestException(
        'Error fetching agent request: ' + error.message,
      );
    }
  }

  async approve(id: string) {
    const request = await this.findOne(id);
    request.status = AgentRequestStatus.APPROVED;

    // Update the user role to 'agent'
    const user = request.user;
    user.role = UserRole.AGENT;
    await this.userRepo.save(user);
    // Save the updated request


    /*TODO: Send email to user notifying about the approval*/
    /*TODO: Create a new agent profile for the user*/
    await this.agentReqRepository.save(request);
    return {messaje: 'Request approved successfully'};
  }

  async reject(id: string) {
    const request = await this.findOne(id);
    request.status = AgentRequestStatus.REJECTED;
    await this.agentReqRepository.save(request);
    return { message: 'Request rejected successfully' };
  }
}
