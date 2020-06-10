import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  HttpException,
  HttpStatus,
  Query,
  Req,
  Res,
  Logger,
} from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from './order.dto';
import { OrderService } from './order.service';
import { Order } from './order.schema';
import { PaymentService } from 'src/payment/payment.service';
import { PaymentStatus, OrderStatus } from 'src/status/status.enum';
import { DeliveryService } from 'src/delivery/delivery.service';
import { PollingService } from 'src/polling/polling.service';
import { Request, Response } from 'express';

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
    @Res() response: Response,
  ): Promise<void> {
    let createdOrder = await this.orderService.create(order);
    response.send(createdOrder);
    logger.log('Order created');

    const paymentResponse = await this.paymentService.create(createdOrder.uuid);
    logger.log('Payment created');

    if (paymentResponse && paymentResponse.status === PaymentStatus.Confirmed) {
      logger.log('Payment successful');
      createdOrder = await this.orderService.update(createdOrder.uuid, {
        status: OrderStatus.Confirmed,
      });
      this.pollingService.publish(`order:${createdOrder.uuid}`, createdOrder);
      logger.log('Order status updated to CONFIRMED');

      const deliveryResult = await this.deliveryService.create(
        createdOrder.uuid,
      );
      createdOrder = await this.orderService.update(createdOrder.uuid, {
        status: deliveryResult ? OrderStatus.Delivered : OrderStatus.Cancelled,
      });
      this.pollingService.publish(`order:${createdOrder.uuid}`, createdOrder);
      logger.log('Order status updated to DELIVERED');

    } else {
      logger.log('Payment declined');
      createdOrder = await this.orderService.update(createdOrder.uuid, {
        status: OrderStatus.Cancelled,
      });
      this.pollingService.publish(`order:${createdOrder.uuid}`, createdOrder);
      logger.log('Order status updated to CANCELLED');
    }
  }

  @Get(':id')
  async getOrder(
    @Param('id') orderUuid: String,
    @Query('polling') polling: 'true' | 'false',
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    let order = await this.orderService.find(orderUuid);
    if (polling === 'true') {
      this.pollingService.subscribe(`order:${orderUuid}`, request, response);
    } else {
      if (order === null) {
        throw new HttpException('Order not found.', HttpStatus.NOT_FOUND);
      }
      response.send(order);
    }
  }

  @Patch(':id')
  async updateOrder(
    @Param('id') orderUuid: string,
    @Body() body: UpdateOrderDto,
  ): Promise<Order> {
    let order = await this.orderService.update(orderUuid, body);
    if (order === null) {
      throw new HttpException('Order not found.', HttpStatus.NOT_FOUND);
    }
    this.pollingService.publish(`order:${orderUuid}`, order);
    return order;
  }
}
