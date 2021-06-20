import Member from "@/models/member.model";
import Payment from "@/models/payment.model";

interface Payable {
  allowed_payment_types: [string];
  amount: number;
  payer: Member;
  topic: string;
  notes: string;
  payment: Payment;
}

export default Payable;
