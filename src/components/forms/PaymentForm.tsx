'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/TextArea';
import { Button } from '@/components/ui/Button';
import { createPayment, updatePayment, PaymentCreateData, PaymentUpdateData, PaymentWithDetails } from '@/services/paymentService';
import { toast } from 'react-toastify';

type PaymentFormData = {
  amount: number;
  currency: 'BRL' | 'USD' | 'EUR' | 'ARS';
  paymentMethod: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'pix' | 'check';
  paymentDate: string;
  referenceNumber?: string;
  notes?: string;
};

interface PaymentFormProps {
  travelId: string;
  payment?: PaymentWithDetails;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PaymentForm({ travelId, payment, onSuccess, onCancel }: PaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!payment;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<PaymentFormData>({
    defaultValues: payment ? {
      amount: Number(payment.amount),
      currency: payment.currency || 'BRL',
      paymentMethod: payment.paymentMethod,
      paymentDate: (payment.paymentDate instanceof Date
        ? payment.paymentDate.toISOString()
        : payment.paymentDate).split('T')[0],
      referenceNumber: payment.referenceNumber || '',
      notes: payment.notes || ''
    } : {
      currency: 'BRL',
      paymentDate: new Date().toISOString().split('T')[0]
    }
  });

  const selectedCurrency = watch('currency');

  const onSubmit = async (data: PaymentFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditing && payment) {
        await updatePayment(payment.id, data as PaymentUpdateData);
        toast.success('Pagamento atualizado com sucesso!');
      } else {
        await createPayment(travelId, data as PaymentCreateData);
        toast.success('Pagamento registrado com sucesso!');
      }
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar pagamento');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setValue('amount', value);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Valor */}
        <div>
          <Input
            label="Valor *"
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
            {...register('amount', { valueAsNumber: true })}
            onChange={handleAmountChange}
            error={errors.amount?.message}
          />
        </div>

        {/* Moeda */}
        <div>
          <Select
            label="Moeda"
            {...register('currency')}
            error={errors.currency?.message}
          >
            <option value="BRL">Real (BRL)</option>
            <option value="USD">Dólar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="ARS">Peso Argentino (ARS)</option>
          </Select>
        </div>

        {/* Método de Pagamento */}
        <div>
          <Select
            label="Método de Pagamento *"
            {...register('paymentMethod')}
            error={errors.paymentMethod?.message}
          >
            <option value="">Selecione...</option>
            <option value="cash">Dinheiro</option>
            <option value="credit_card">Cartão de Crédito</option>
            <option value="debit_card">Cartão de Débito</option>
            <option value="bank_transfer">Transferência Bancária</option>
            <option value="pix">PIX</option>
            <option value="check">Cheque</option>
          </Select>
        </div>

        {/* Data do Pagamento */}
        <div>
          <Input
            label="Data do Pagamento *"
            type="date"
            {...register('paymentDate')}
            error={errors.paymentDate?.message}
          />
        </div>

        {/* Número de Referência */}
        <div className="md:col-span-2">
          <Input
            label="Número de Referência"
            placeholder="Ex: Comprovante, Cheque, etc."
            {...register('referenceNumber')}
            error={errors.referenceNumber?.message}
          />
        </div>

        {/* Observações */}
        <div className="md:col-span-2">
          <Textarea
            label="Observações"
            placeholder="Observações sobre o pagamento..."
            rows={3}
            {...register('notes')}
            error={errors.notes?.message}
          />
        </div>
      </div>

      {/* Preview do valor formatado */}
      {watch('amount') && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            Valor: {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: selectedCurrency
            }).format(watch('amount') || 0)}
          </p>
        </div>
      )}

      {/* Botões */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar Pagamento' : 'Registrar Pagamento'}
        </Button>
      </div>
    </form>
  );
}