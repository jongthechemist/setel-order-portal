export class PaymentResponseDto {
  orderUuid: String;
  status: "DECLINED" | "CONFIRMED"
}