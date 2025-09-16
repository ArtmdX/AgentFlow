'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Clock, CreditCard, User } from 'lucide-react';
import { getPaymentsByTravel, PaymentWithDetails, formatPaymentMethod, formatCurrency } from '@/services/paymentService';
import { TableSkeleton } from '@/components/ui/Loading';

interface PaymentTimelineProps {
  travelId: string;
}

export default function PaymentTimeline({ travelId }: PaymentTimelineProps) {
  const [payments, setPayments] = useState<PaymentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [travelId]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPaymentsByTravel(travelId);
      setPayments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar timeline');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Histórico de Pagamentos</h3>
        </div>
        <div className="p-6">
          <TableSkeleton rows={3} cols={1} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Histórico de Pagamentos</h3>
        </div>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Erro: {error}</p>
            <button
              onClick={loadPayments}
              className="mt-2 text-sm text-red-700 hover:text-red-900 underline"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Histórico de Pagamentos</h3>
      </div>

      <div className="p-6">
        {payments.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum pagamento registrado ainda</p>
          </div>
        ) : (
          <div className="flow-root">
            <ul className="-mb-8">
              {payments.map((payment, paymentIdx) => (
                <li key={payment.id}>
                  <div className="relative pb-8">
                    {paymentIdx !== payments.length - 1 ? (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                          <CheckCircle className="h-5 w-5 text-white" aria-hidden="true" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            Pagamento de{' '}
                            <span className="font-medium text-gray-900">
                              {formatCurrency(Number(payment.amount), payment.currency || 'BRL')}
                            </span>{' '}
                            via{' '}
                            <span className="font-medium text-gray-900">
                              {formatPaymentMethod(payment.paymentMethod)}
                            </span>
                          </p>
                          {payment.referenceNumber && (
                            <p className="text-xs text-gray-400 mt-1">
                              Ref: {payment.referenceNumber}
                            </p>
                          )}
                          {payment.notes && (
                            <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                              {payment.notes}
                            </p>
                          )}
                          <div className="flex items-center mt-2 space-x-4 text-xs text-gray-400">
                            <div className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {payment.createdBy.firstName} {payment.createdBy.lastName}
                            </div>
                            <div className="flex items-center">
                              <CreditCard className="h-3 w-3 mr-1" />
                              Data do Pagamento: {formatDate(payment.paymentDate)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right whitespace-nowrap text-sm text-gray-500">
                          <div>{formatDate(payment.createdAt!)}</div>
                          <div className="text-xs">{formatTime(payment.createdAt!)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}