'use client';

import { AlertTriangle, X, User, Mail, FileText } from 'lucide-react';

interface DuplicateCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  documentNumber: string | null;
}

interface Duplicate {
  field: string;
  value: string;
  customer: DuplicateCustomer;
}

interface DuplicateWarningModalProps {
  isOpen: boolean;
  duplicates: Duplicate[];
  onClose: () => void;
  onOverride: () => void;
  onViewCustomer?: (customerId: string) => void;
}

export function DuplicateWarningModal({
  isOpen,
  duplicates,
  onClose,
  onOverride,
  onViewCustomer,
}: DuplicateWarningModalProps) {
  if (!isOpen || duplicates.length === 0) return null;

  const getFieldLabel = (field: string): string => {
    const labels: Record<string, string> = {
      email: 'E-mail',
      documentNumber: 'CPF/CNPJ',
      phone: 'Telefone',
    };
    return labels[field] || field;
  };

  const getFieldIcon = (field: string) => {
    const icons: Record<string, React.ElementType> = {
      email: Mail,
      documentNumber: FileText,
      phone: User,
    };
    const Icon = icons[field] || FileText;
    return <Icon className="h-5 w-5 text-yellow-600" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Possível Cliente Duplicado
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Encontramos {duplicates.length} cliente(s) com informações semelhantes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {duplicates.map((duplicate, index) => (
            <div
              key={`${duplicate.customer.id}-${duplicate.field}-${index}`}
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">{getFieldIcon(duplicate.field)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {getFieldLabel(duplicate.field)} já cadastrado
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">{duplicate.value}</span> já está vinculado a:
                  </p>
                  <div className="mt-3 bg-white rounded p-3 border border-yellow-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {duplicate.customer.firstName} {duplicate.customer.lastName}
                        </p>
                        <div className="mt-1 space-y-1">
                          {duplicate.customer.email && (
                            <p className="text-xs text-gray-600 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {duplicate.customer.email}
                            </p>
                          )}
                          {duplicate.customer.documentNumber && (
                            <p className="text-xs text-gray-600 flex items-center">
                              <FileText className="h-3 w-3 mr-1" />
                              {duplicate.customer.documentNumber}
                            </p>
                          )}
                        </div>
                      </div>
                      {onViewCustomer && (
                        <button
                          onClick={() => onViewCustomer(duplicate.customer.id)}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          Ver Perfil
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-gray-50 rounded-lg p-4 mt-6">
            <p className="text-sm text-gray-700">
              <strong>O que deseja fazer?</strong>
            </p>
            <ul className="mt-2 text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>
                Clique em <strong>Cancelar</strong> para revisar os dados antes de salvar
              </li>
              <li>
                Clique em <strong>Salvar Mesmo Assim</strong> se confirmar que é um cliente
                diferente
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onOverride}
            className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 border border-transparent rounded-md shadow-sm hover:bg-yellow-700 transition-colors"
          >
            Salvar Mesmo Assim
          </button>
        </div>
      </div>
    </div>
  );
}
