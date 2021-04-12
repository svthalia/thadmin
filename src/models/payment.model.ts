interface Payment {
  pk: string;
  get_type_display: string;
  amount: number;
  created_at: string;
  topic: string;
  notes: string;
}

export default Payment;
