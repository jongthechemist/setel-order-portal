import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentService } from './payment.service';

@Module({
  providers: [PaymentService, ConfigService],
  exports: [PaymentService]
})
export class PaymentModule {}
