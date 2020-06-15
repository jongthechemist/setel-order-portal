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
        const connection = configService.get<string>('MONGO_CONNECTION');
        Logger.log('Connecting to mongo atlas at ' + connection, 'AppModule')
        return { uri: connection }
      },
      inject: [ConfigService],
    }),
    OrderModule,
    OrdersModule,
    PaymentModule,
    DeliveryModule
  ],
  controllers: [AppController],
  providers: [AppService, PollingService],
})
export class AppModule {}
