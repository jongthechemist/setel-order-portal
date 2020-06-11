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
  get status(): String {
    return this.data.status;
  }
  set status(value: String) {
    this.data.status = value;
  }
  get uuid(): String {
    return this.data.uuid;
  }
  set uuid(value: String) {
    this.data.uuid = value;
  }
  save(options: any) {
    return this.data;
  }
  static findOne(filter: any): any {
    return new MockOrder(MockOrder.data);
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
    await expect(
      service.updateStatus('abcd', 'CONFIRMED'),
    ).resolves.toHaveProperty('status', 'CONFIRMED');
    await expect(
      service.updateStatus('abcd', 'CANCELLED'),
    ).resolves.toHaveProperty('status', 'CANCELLED');
    await expect(
      service.updateStatus('abcd', 'DELIVERED'),
    ).resolves.toHaveProperty('status', 'DELIVERED');
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
