export class PaymentRequestDto {
  token?: string;
  secret?: string;
  data?: any;
}
export class PaymentResponseDto {
  orderUuid: string;
  status: "DECLINED" | "CONFIRMED"
}