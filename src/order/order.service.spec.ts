import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { Order } from './order.schema';
import { getModelToken } from '@nestjs/mongoose';
import { CreateOrderDto } from './order.dto';

export class MockOrder {
  static data: any;
  constructor(public data?: any) {
    data.save = this.save;
    MockOrder.data = data;
  }
  get status(): string {
    return this.data.status;
  }
  set status(value: string) {
    this.data.status = value;
  }
  get uuid(): string {
    return this.data.uuid;
  }
  set uuid(value: string) {
    this.data.uuid = value;
  }
  save(): any {
    return MockOrder.data;
  }
  static findOne(): any {
    return MockOrder.data;
  }
}

describe('OrderService', () => {
  let service: OrderService;
  const dto: CreateOrderDto = {
    items: [],
    createdDate: new Date(),
    createdBy: 'Nizam',
    createdById: '1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getModelToken(Order.name),
          useValue: MockOrder,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create order with uuid', async () => {
    expect.assertions(1);
    const result = await service.create(dto);
    expect(result.uuid).toBeDefined();
  });

  it('should create order with status CREATED', async () => {
    expect.assertions(1);
    const result = await service.create(dto);
    expect(result.status).toBe('CREATED');
  });

  it('should find an order', async () => {
    expect.assertions(1);
    const result = await service.find('abcd');
    expect(result).toBeDefined();
  });

  it('should update order status', async () => {
    expect.assertions(3);
    const confirmed = await service.updateStatus('abcd', 'CONFIRMED');
    expect(confirmed).toHaveProperty('status', 'CONFIRMED');
    const delivered = await service.updateStatus('abcd', 'DELIVERED');
    expect(delivered).toHaveProperty('status', 'DELIVERED');
    const cancelled = await service.updateStatus('abcd', 'CANCELLED');
    expect(cancelled).toHaveProperty('status', 'CANCELLED');
  });
  
  it('should not update order once status is cancelled', async () => {
    expect.assertions(1);
    await service.updateStatus('abcd', 'CANCELLED');
    const confirmed = await service.updateStatus('abcd', 'CONFIRMED');
    expect(confirmed).toHaveProperty('status', 'CANCELLED');
  });

  it('should not update status if order not found', async () => {
    expect.assertions(2);
    jest.spyOn(MockOrder, 'findOne').mockResolvedValue(null);
    jest.spyOn(MockOrder.data, 'save');
    const result = await service.updateStatus('def', 'CONFIRMED');
    expect(result).toBeNull();
    expect(MockOrder.data.save).not.toBeCalled();
  });
});
