import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { getModelToken } from '@nestjs/mongoose';
import { Order } from '../order/order.schema';
import { MockOrder } from '../order/order.service.spec';
import { OrderDto } from 'src/order/order.dto';
import { OrdersService } from './orders.service';

describe('Orders Controller', () => {
  let controller: OrdersController;
  let ordersService: OrdersService;

  const ordersDto: OrderDto[] = [
    {
      uuid: 'abcd',
      status: 'CREATED',
      items: [],
      createdBy: 'Adam',
      createdById: '1',
      createdDate: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        OrdersService,
        {
          provide: getModelToken(Order.name),
          useValue: MockOrder,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    ordersService = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return list of orders', async () => {
    expect.assertions(1);
    jest.spyOn(ordersService, 'findAll').mockResolvedValue(ordersDto);
    const result = await controller.getOrders();
    expect(result).toBe(ordersDto);
  });
});
