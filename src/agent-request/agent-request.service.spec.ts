import { Test, TestingModule } from '@nestjs/testing';
import { AgentRequestService } from './agent-request.service';

describe('AgentRequestService', () => {
  let service: AgentRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgentRequestService],
    }).compile();

    service = module.get<AgentRequestService>(AgentRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
