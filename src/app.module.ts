import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { OrderModule } from './order/order.module';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentModule } from './payment/payment.module';
import { DeliveryModule } from './delivery/delivery.module';
import { PollingService } from './polling/polling.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (
        configService: ConfigService,
      ): MongooseModuleOptions => {
        const domain = configService.get<string>('DATABASE_DOMAIN');
        const port = configService.get<string>('DATABASE_PORT');
        const name = configService.get<string>('DATABASE_NAME');
        return { uri: `${domain}:${port}/${name}` };
      },
      inject: [ConfigService],
    }),
    OrderModule,
    OrdersModule,
    PaymentModule,
    DeliveryModule,
  ],
  controllers: [AppController],
  providers: [AppService, PollingService],
})
export class AppModule {}
