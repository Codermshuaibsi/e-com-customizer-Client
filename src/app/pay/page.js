"use client";
import { Suspense } from "react";
import PaymentCheckout from "../components/PaymentCheckout";

export default function CartPaymentPage() {
  return (
     <Suspense fallback={<div>Loading Payment Info...</div>}>
      <PaymentCheckout/>
      </Suspense>

  );
}