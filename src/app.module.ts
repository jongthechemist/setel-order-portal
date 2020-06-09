import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersController } from './orders/orders.controller';
import { OrderController } from './order/order.controller';

@Module({
  imports: [],
  controllers: [AppController, OrdersController, OrderController],
  providers: [AppService],
})
export class AppModule {}
