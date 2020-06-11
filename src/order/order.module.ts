import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema, Order } from './order.schema';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PaymentModule } from '../payment/payment.module';
import { DeliveryModule } from '../delivery/delivery.module';
import { PollingService } from '../polling/polling.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    PaymentModule,
    DeliveryModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, PollingService],
})
export class OrderModule {}
