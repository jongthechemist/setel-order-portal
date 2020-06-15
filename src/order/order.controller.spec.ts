import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { PaymentModule } from '../payment/payment.module';
import { DeliveryModule } from '../delivery/delivery.module';
import { OrderService } from './order.service';
import { PollingService } from '../polling/polling.service';
import { CreateOrderDto, OrderDto } from './order.dto';
import { Order } from './order.schema';
import { getModelToken } from '@nestjs/mongoose';
import { MockOrder } from './order.service.spec';
import { PaymentService } from '../payment/payment.service';
import { DeliveryService } from '../delivery/delivery.service';
import { PaymentResponseDto } from '../payment/payment.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('Order Controller', () => {
  let controller: OrderController;
  let orderService: OrderService;
  let paymentService: PaymentService;
  let deliveryService: DeliveryService;
  let pollingService: PollingService;

  const orderDto: OrderDto = {
    uuid: 'abcd',
    status: 'CREATED',
    items: [],
    createdBy: 'Adam',
    createdById: '1',
    createdDate: new Date(),
  };
  const createOrderDto: CreateOrderDto = {
    items: [],
    createdBy: 'Adam',
    createdById: '1',
    createdDate: new Date(),
  };
  const paymentResponseDto: PaymentResponseDto = {
    orderUuid: 'abcd',
    status: 'CONFIRMED',
  };
  const mockRequest = { on: jest.fn() };
  const mockResponse = { send: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PaymentModule, DeliveryModule],
      controllers: [OrderController],
      providers: [
        PollingService,
        OrderService,
        {
          provide: getModelToken(Order.name),
          useValue: MockOrder,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>(OrderService);
    paymentService = module.get<PaymentService>(PaymentService);
    deliveryService = module.get<DeliveryService>(DeliveryService);
    pollingService = module.get<PollingService>(PollingService);

    jest.spyOn(orderService, 'create').mockResolvedValue(orderDto);
    jest.spyOn(orderService, 'find').mockResolvedValue(orderDto);
    jest.spyOn(orderService, 'updateStatus').mockResolvedValue(orderDto);

    jest.spyOn(paymentService, 'create').mockResolvedValue(paymentResponseDto);
    jest.spyOn(deliveryService, 'create').mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create order with uuid', async () => {
    expect.assertions(1);
    const mockResponse = { send: jest.fn() };
    await controller.createOrder(createOrderDto, mockResponse);
    expect(mockResponse.send).toBeCalledWith(orderDto);
  });

  it('should set status to CONFIRMED if payment successful', async () => {
    expect.assertions(1);
    const mockResponse = { send: jest.fn() };
    jest
      .spyOn(paymentService, 'create')
      .mockResolvedValue({ orderUuid: 'abcd', status: 'CONFIRMED' });
    await controller.createOrder(orderDto, mockResponse);
    expect(orderService.updateStatus).toHaveBeenCalledWith('abcd', 'CONFIRMED');
  });

  it('should set status to CANCELLED if payment is declined', async () => {
    expect.assertions(1);
    const mockResponse = { send: jest.fn() };
    jest
      .spyOn(paymentService, 'create')
      .mockResolvedValue({ orderUuid: 'abcd', status: 'DECLINED' });
    await controller.createOrder(orderDto, mockResponse);
    expect(orderService.updateStatus).toHaveBeenCalledWith('abcd', 'CANCELLED');
  });

  it('should set status to DELIVERED if delivery is successful', async () => {
    expect.assertions(1);
    jest.spyOn(deliveryService, 'create').mockResolvedValue(true);
    await controller.createOrder(orderDto, mockResponse);
    expect(orderService.updateStatus).toHaveBeenCalledWith('abcd', 'DELIVERED');
  });

  it('should return order if found', async () => {
    expect.assertions(1);
    const order = await controller.getOrder('abcd');
    expect(order).toBe(orderDto);
  });

  it('should throw error not found if order not found', async () => {
    expect.assertions(2);
    jest.spyOn(orderService, 'find').mockResolvedValue(null);
    try {
      await controller.getOrder('abcd');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.status).toBe(HttpStatus.NOT_FOUND);
    }
  });

  it('should update order status if cancelled', async () => {
    expect.assertions(1);
    await controller.cancelOrder('abcd');
    expect(orderService.updateStatus).toHaveBeenCalledWith('abcd', 'CANCELLED');
  });

  it('should return order status', async () => {
    expect.assertions(1);
    await controller.getStatus('abcd', 'false', mockRequest, mockResponse);
    expect(mockResponse.send).toHaveBeenCalledWith({
      status: 'CREATED',
      canPoll: controller.canPoll('CREATED'),
    });
  });

  it('should throw error not found on get status if order not found', async () => {
    expect.assertions(2);
    jest.spyOn(orderService, 'find').mockResolvedValue(null);
    try {
      await controller.getStatus('abcd', 'false', mockRequest, mockResponse);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.status).toBe(HttpStatus.NOT_FOUND);
    }
  });

  it('should return with canPoll = true if status can be polled', () => {
    const expectedResults = {
      CREATED: true,
      CONFIRMED: true,
      DELIVERED: false,
      CANCELLED: false,
    };
    for (const status in expectedResults) {
      expect(controller.canPoll(status)).toBe(expectedResults[status]);
    }
  });
});
