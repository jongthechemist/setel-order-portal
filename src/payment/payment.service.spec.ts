import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { PaymentResponseDto } from './payment.dto';

describe('PaymentService', () => {
  let paymentService: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentService, ConfigService],
    }).compile();

    paymentService = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(paymentService).toBeDefined();
  });

  it('should send payment request', async () => {
    const dto: PaymentResponseDto = { orderUuid: 'abcd', status: 'CONFIRMED' };
    jest
      .spyOn(paymentService.client, 'send')
      .mockImplementation(() => {
        const response = new Observable<PaymentResponseDto>(subscriber => {
          setTimeout(() => {
            subscriber.next(dto);
            subscriber.complete();
          }, 1000);
        });
        return response;
      });
    const response = await paymentService.create('abcd');

    expect(response).toBe(dto);
  });
});
