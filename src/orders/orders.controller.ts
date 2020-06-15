import { Controller, Get } from '@nestjs/common';
import { Orders } from './orders.schema';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {

  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getOrders(): Promise<Orders> {
    const orders = await this.ordersService.findAll();
    return orders;
  }
}
