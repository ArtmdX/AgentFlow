import { useState, useEffect } from 'react';
import { calculateBalance, applyDiscount, calculateLateFees, calculatePaymentPercentage } from '@/lib/calculations';

interface UseBalanceCalculationProps {
  totalValue: number;
  paidValue: number;
}

export function useBalanceCalculation({ totalValue, paidValue }: UseBalanceCalculationProps) {
  const [balance, setBalance] = useState(0);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const newBalance = calculateBalance(totalValue, paidValue);
    const newPercentage = calculatePaymentPercentage(totalValue, paidValue);

    setBalance(newBalance);
    setPercentage(newPercentage);
  }, [totalValue, paidValue]);

  return { balance, percentage };
}

interface UseDiscountCalculationProps {
  amount: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
}

export function useDiscountCalculation({ amount, discountType, discountValue }: UseDiscountCalculationProps) {
  const [finalAmount, setFinalAmount] = useState(amount);
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    const newFinalAmount = applyDiscount(amount, discountType, discountValue);
    const newDiscountAmount = amount - newFinalAmount;

    setFinalAmount(newFinalAmount);
    setDiscountAmount(newDiscountAmount);
  }, [amount, discountType, discountValue]);

  return { finalAmount, discountAmount };
}

interface UseLateFeeCalculationProps {
  amount: number;
  dueDate: Date;
  interestRate?: number;
  penaltyRate?: number;
}

export function useLateFeeCalculation({
  amount,
  dueDate,
  interestRate = 0.01,
  penaltyRate = 0.02
}: UseLateFeeCalculationProps) {
  const [finalAmount, setFinalAmount] = useState(amount);
  const [lateFees, setLateFees] = useState(0);
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    const today = new Date();
    const overdue = dueDate < today;

    setIsOverdue(overdue);

    if (overdue) {
      const newFinalAmount = calculateLateFees(amount, dueDate, interestRate, penaltyRate);
      const fees = newFinalAmount - amount;

      setFinalAmount(newFinalAmount);
      setLateFees(fees);
    } else {
      setFinalAmount(amount);
      setLateFees(0);
    }
  }, [amount, dueDate, interestRate, penaltyRate]);

  return { finalAmount, lateFees, isOverdue };
}

interface UseTotalCalculationProps {
  items: Array<{ amount: number; quantity?: number }>;
}

export function useTotalCalculation({ items }: UseTotalCalculationProps) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const newTotal = items.reduce((sum, item) => {
      const itemTotal = item.amount * (item.quantity || 1);
      return sum + itemTotal;
    }, 0);

    setTotal(newTotal);
  }, [items]);

  return { total };
}
