import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryService } from './delivery.service';

describe('DeliveryService', () => {
  let service: DeliveryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryService],
    }).compile();

    service = module.get<DeliveryService>(DeliveryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return true or false', async () => {
    expect.assertions(1);
    const options = [true, false];
    const result = await service.create('1234');
    expect(options).toContain(result);
  });
});
