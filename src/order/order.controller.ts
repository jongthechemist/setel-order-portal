import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Query,
  Res,
  Logger,
  Put,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderStatus } from '../status/status.enum';
import { PaymentService } from '../payment/payment.service';
import { DeliveryService } from '../delivery/delivery.service';
import { PollingService } from '../polling/polling.service';
import { OrderResponse } from './order.interface';
import { CreateOrderDto, OrderStatusDto, OrderDto } from './order.dto';

const logger = new Logger('OrderController');
@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
    private readonly deliveryService: DeliveryService,
    private readonly pollingService: PollingService,
  ) {}

  @Post()
  async createOrder(
    @Body() order: CreateOrderDto,
    @Res() response: OrderResponse<OrderDto>,
  ): Promise<void> {
    let createdOrder = await this.orderService.create(order);
    response.send(createdOrder);

    const updateStatus = async (orderStatus: OrderStatus) => {
      createdOrder = await this.orderService.updateStatus(
        createdOrder.uuid,
        orderStatus,
      );
      logger.log('Order status updated to ' + createdOrder.status);
    };

    const paymentResponse = await this.paymentService.create(createdOrder.uuid);
    if (paymentResponse && paymentResponse.status === 'CONFIRMED') {
      updateStatus('CONFIRMED');
      const deliveryResult = await this.deliveryService.create(
        createdOrder.uuid,
      );
      if (deliveryResult) {
        updateStatus('DELIVERED');
      }
    } else {
      updateStatus('CANCELLED');
    }
  }

  @Get(':id')
  async getOrder(@Param('id') orderUuid: string): Promise<OrderDto> {
    const order = await this.orderService.find(orderUuid);
    if (order === null) {
      throw new HttpException('Order not found.', HttpStatus.NOT_FOUND);
    }
    return order;
  }

  @Put(':id/cancel')
  async cancelOrder(@Param('id') orderUuid: string): Promise<OrderDto> {
    const order = await this.orderService.updateStatus(orderUuid, 'CANCELLED');
    return order;
  }

  @Get(':id/status')
  async getStatus(
    @Param('id') orderUuid: string,
    @Query('polling') polling: 'true' | 'false',
    @Res() response: OrderResponse<OrderStatusDto>,
  ): Promise<void> {
    const order = await this.orderService.find(orderUuid);
    if (polling === 'true' && this.canPoll(order.status)) {
      const polledOrder = await this.pollingService.subscribe(
        () => this.orderService.find(orderUuid),
        (newOrder) => order.status !== newOrder.status,
        5000
      );
      response.send({ status: polledOrder.status, canPoll: this.canPoll(order.status)  });
    } else {
      if (order === null) {
        throw new HttpException('Order not found.', HttpStatus.NOT_FOUND);
      }
      response.send({ status: order.status, canPoll: this.canPoll(order.status)  });
    }
  }

  canPoll(status: string): boolean {
    return status !== 'DELIVERED' && status !== 'CANCELLED';
  }
}
