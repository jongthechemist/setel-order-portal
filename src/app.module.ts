import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderModule } from './order/order.module';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule } from '@nestjs/config';
import { PaymentModule } from './payment/payment.module';
import { DeliveryModule } from './delivery/delivery.module';
import { PollingService } from './polling/polling.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(`${process.env.DATABASE_DOMAIN}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`),
    OrderModule,
    OrdersModule,
    PaymentModule,
    DeliveryModule,
  ],
  controllers: [AppController],
  providers: [AppService, PollingService],
})
export class AppModule {}
