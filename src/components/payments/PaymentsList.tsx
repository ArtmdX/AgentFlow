'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CreditCard, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useConfirmDialog } from '@/components/ui/ConfirmDialog';
import PaymentForm from '@/components/forms/PaymentForm';
import { TableSkeleton } from '@/components/ui/Loading';
import {
  getPaymentsByTravel,
  deletePayment,
  PaymentWithDetails,
  formatPaymentMethod,
  formatCurrency
} from '@/services/paymentService';
import { toast } from 'react-toastify';

interface PaymentsListProps {
  travelId: string;
  totalValue: number;
  onPaymentChange?: () => void;
}

export default function PaymentsList({ travelId, totalValue, onPaymentChange }: PaymentsListProps) {
  const [payments, setPayments] = useState<PaymentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentWithDetails | null>(null);

  const { openDialog, ConfirmDialog: ConfirmDialogComponent } = useConfirmDialog();

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPaymentsByTravel(travelId);
      setPayments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pagamentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [travelId]);

  const handlePaymentSuccess = () => {
    setShowAddModal(false);
    setEditingPayment(null);
    loadPayments();
    onPaymentChange?.();
  };

  const handleDeletePayment = async (paymentId: string) => {
    try {
      await deletePayment(paymentId);
      toast.success('Pagamento excluído com sucesso!');
      loadPayments();
      onPaymentChange?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao excluir pagamento');
    }
  };

  const confirmDelete = (payment: PaymentWithDetails) => {
    openDialog({
      title: 'Excluir Pagamento',
      message: `Tem certeza que deseja excluir o pagamento de ${formatCurrency(Number(payment.amount), payment.currency || 'BRL')}?`,
      variant: 'danger',
      confirmText: 'Excluir',
      onConfirm: () => handleDeletePayment(payment.id)
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  // Cálculos
  const totalPaid = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  const remainingValue = totalValue - totalPaid;
  const paymentPercentage = totalValue > 0 ? (totalPaid / totalValue) * 100 : 0;

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Pagamentos</h3>
        </div>
        <div className="p-6">
          <TableSkeleton rows={3} cols={4} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Pagamentos</h3>
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
    <>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Pagamentos</h3>
          <Button
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Adicionar Pagamento</span>
          </Button>
        </div>

        {/* Resumo de Pagamentos */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total da Viagem</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(totalValue)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Pago</p>
              <p className="text-lg font-semibold text-green-600">
                {formatCurrency(totalPaid)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Saldo Devedor</p>
              <p className={`text-lg font-semibold ${remainingValue <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(remainingValue)}
              </p>
            </div>
          </div>

          {/* Barra de Progresso */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progresso do Pagamento</span>
              <span>{Math.min(paymentPercentage, 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  paymentPercentage >= 100 ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(paymentPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Lista de Pagamentos */}
        <div className="p-6">
          {payments.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Nenhum pagamento registrado</p>
              <Button
                onClick={() => setShowAddModal(true)}
                variant="outline"
              >
                Registrar Primeiro Pagamento
              </Button>
            </div>
          ) : (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Método
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referência
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Criado por
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {formatDate(payment.paymentDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(Number(payment.amount), payment.currency || 'BRL')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatPaymentMethod(payment.paymentMethod)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {payment.referenceNumber || '-'}
                        </div>
                        {payment.notes && (
                          <div className="text-xs text-gray-500 mt-1">
                            {payment.notes}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          {payment.createdBy.firstName} {payment.createdBy.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setEditingPayment(payment)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => confirmDelete(payment)}
                            className="text-red-600 hover:text-red-900"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Adicionar Pagamento */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Registrar Pagamento"
        size="lg"
      >
        <PaymentForm
          travelId={travelId}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Modal de Editar Pagamento */}
      <Modal
        isOpen={!!editingPayment}
        onClose={() => setEditingPayment(null)}
        title="Editar Pagamento"
        size="lg"
      >
        {editingPayment && (
          <PaymentForm
            travelId={travelId}
            payment={editingPayment}
            onSuccess={handlePaymentSuccess}
            onCancel={() => setEditingPayment(null)}
          />
        )}
      </Modal>

      {/* Dialog de Confirmação */}
      <ConfirmDialogComponent />
    </>
  );
}