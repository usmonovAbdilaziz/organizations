import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationServiceController } from './organization-service.controller';
import { OrganizationServiceService } from './organization-service.service';

describe('OrganizationServiceController', () => {
  let controller: OrganizationServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationServiceController],
      providers: [OrganizationServiceService],
    }).compile();

    controller = module.get<OrganizationServiceController>(OrganizationServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
