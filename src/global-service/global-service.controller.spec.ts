import { Test, TestingModule } from '@nestjs/testing';
import { GlobalServiceController } from './global-service.controller';
import { GlobalServiceService } from './global-service.service';

describe('GlobalServiceController', () => {
  let controller: GlobalServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GlobalServiceController],
      providers: [GlobalServiceService],
    }).compile();

    controller = module.get<GlobalServiceController>(GlobalServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
