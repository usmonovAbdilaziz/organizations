import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationServiceService } from './organization-service.service';

describe('OrganizationServiceService', () => {
  let service: OrganizationServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationServiceService],
    }).compile();

    service = module.get<OrganizationServiceService>(OrganizationServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
