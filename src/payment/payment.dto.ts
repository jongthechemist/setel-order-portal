export class PaymentRequestDto {
  token?: String;
  secret?: String;
  data?: any;
}
export class PaymentResponseDto {
  orderUuid: String;
  status: "DECLINED" | "CONFIRMED"
}