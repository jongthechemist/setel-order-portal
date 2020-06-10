import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Query,
  Req,
  Res,
  Logger,
  Put,
} from '@nestjs/common';
import { CreateOrderDto, OrderStatusDto } from './order.dto';
import { OrderService } from './order.service';
import { Order } from './order.schema';
import { PaymentService } from 'src/payment/payment.service';
import { DeliveryService } from 'src/delivery/delivery.service';
import { PollingService } from 'src/polling/polling.service';
import { Request, Response } from 'express';
import { OrderStatus } from 'src/status/status.enum';

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

    const updateStatus = async (orderStatus: OrderStatus) => {
      createdOrder = await this.orderService.updateStatus(
        createdOrder.uuid,
        orderStatus,
      );
      this.pollingService.publish(
        `order:status:${createdOrder.uuid}`,
        createdOrder,
      );
      logger.log('Order status updated to ' + createdOrder.status);
    };

    if (paymentResponse && paymentResponse.status === 'CONFIRMED') {
      logger.log('Payment successful');
      updateStatus('CONFIRMED');

      const deliveryResult = await this.deliveryService.create(
        createdOrder.uuid,
      );
      if (deliveryResult) {
        logger.log('Delivery successful');
        updateStatus('DELIVERED');
      }
    } else {
      logger.log('Payment declined');
      updateStatus('CANCELLED');
    }
  }

  @Get(':id')
  async getOrder(@Param('id') orderUuid: String): Promise<Order> {
    let order = await this.orderService.find(orderUuid);
    if (order === null) {
      throw new HttpException('Order not found.', HttpStatus.NOT_FOUND);
    }
    return order;
  }

  @Put(':id/cancel')
  async cancelOrder(@Param('id') orderUuid: String): Promise<Order> {
    let order = await this.orderService.updateStatus(orderUuid, 'CANCELLED');
    return order;
  }

  @Get(':id/status')
  async getStatus(
    @Param('id') orderUuid: String,
    @Query('polling') polling: 'true' | 'false',
    @Req() request: Request,
    @Res() response: Response<OrderStatusDto>,
  ): Promise<void> {
    let order = await this.orderService.find(orderUuid);
    if (polling === 'true') {
      this.pollingService.subscribe(
        `order:status:${orderUuid}`,
        request,
        response,
      );
    } else {
      if (order === null) {
        throw new HttpException('Order not found.', HttpStatus.NOT_FOUND);
      }
      response.send({ status: order.status });
    }
  }
}
