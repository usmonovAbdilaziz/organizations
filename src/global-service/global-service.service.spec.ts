import { Test, TestingModule } from '@nestjs/testing';
import { GlobalServiceService } from './global-service.service';

describe('GlobalServiceService', () => {
  let service: GlobalServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GlobalServiceService],
    }).compile();

    service = module.get<GlobalServiceService>(GlobalServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
