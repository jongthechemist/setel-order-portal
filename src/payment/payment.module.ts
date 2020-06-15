import { Module, HttpModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentService } from './payment.service';

@Module({
  imports: [HttpModule],
  providers: [PaymentService, ConfigService],
  exports: [PaymentService]
})
export class PaymentModule {}
