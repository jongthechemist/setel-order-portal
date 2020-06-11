import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { getModelToken } from '@nestjs/mongoose';
import { Order } from '../order/order.schema';
class MockOrder {
  static data: any;
  constructor(public data?: any) {
    MockOrder.data = data;
  }
  static find(filter: any): any {
    return [MockOrder.data];
  }
}

describe('Orders Service', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getModelToken(Order.name),
          useValue: MockOrder,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return list of orders', async () => {
    const order = new MockOrder({
      items: [],
      createdDate: new Date(),
      createdBy: 'Nizam',
      createdById: '1',
    })
    const result = await service.findAll()
    expect(result).toContain(order.data);
  })
});
