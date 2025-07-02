import { Test, TestingModule } from '@nestjs/testing';
import { AgentRequestController } from './agent-request.controller';
import { AgentRequestService } from './agent-request.service';

describe('AgentRequestController', () => {
  let controller: AgentRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgentRequestController],
      providers: [AgentRequestService],
    }).compile();

    controller = module.get<AgentRequestController>(AgentRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
