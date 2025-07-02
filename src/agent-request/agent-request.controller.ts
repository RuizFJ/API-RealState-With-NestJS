import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AgentRequestService } from './agent-request.service';
import { CreateAgentRequestDto } from './dto/create-agent-request.dto';

@Controller('agent-request')
export class AgentRequestController {
  constructor(private readonly agentRequestService: AgentRequestService) {}

  @Post()
  create(@Body() id:string, createAgentRequestDto: CreateAgentRequestDto) {
    return this.agentRequestService.create(id, createAgentRequestDto);
  }

  @Get()
  findAll() {
    return this.agentRequestService.findAllPending();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agentRequestService.findOne(id);
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.agentRequestService.approve(id);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string) {
    return this.agentRequestService.reject(id);
  }
  
}
