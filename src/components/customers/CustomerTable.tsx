'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, PlusCircle } from 'lucide-react';
import { Customer } from '@prisma/client';

interface CustomerTableProps {
  initialCustomers: Customer[];
}

export function CustomerTable({ initialCustomers }: CustomerTableProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [customers, setCustomers] = useState(initialCustomers);
  const router = useRouter();

  // Função para lidar com o clique no botão de novo orçamento
  const handleNewQuoteClick = (e: React.MouseEvent, customerId: string) => {
    e.stopPropagation();

    router.push(`/dashboard/travels/new?customerId=${customerId}`);
  };

  const handleNewMessageClick = (e: React.MouseEvent, customerPhone: string | null) => {
    e.stopPropagation();

    if (!customerPhone) {
      console.error('Número de telefone do cliente não disponível.');
      return;
    }

    const whatsappUrl = `https://wa.me/${customerPhone}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {customers.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-center text-gray-500">Nenhum cliente encontrado.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map(customer => (
                  <tr
                    key={customer.id}
                    className="hover:bg-indigo-100 cursor-pointer transition-colors duration-150"
                    onClick={() => router.push(`/dashboard/customers/${customer.id}`)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{`${customer.firstName} ${customer.lastName}`}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{customer.email || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{customer.phone || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={e => handleNewQuoteClick(e, customer.id)}
                        className="p-1 rounded-full text-gray-500 hover:text-indigo-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        title="Novo Orçamento">
                        <PlusCircle className="h-6 w-6" />
                      </button>
                      <button
                        onClick={e => handleNewMessageClick(e, customer.phone || '')}
                        className="p-1 rounded-full text-gray-500 hover:text-indigo-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        title="Iniciar Conversa no WhatsApp">
                        <MessageCircle className="h-6 w-6" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {customers.map(customer => (
              <div
                key={customer.id}
                className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(`/dashboard/customers/${customer.id}`)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      {`${customer.firstName} ${customer.lastName}`}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{customer.email || '-'}</p>
                    <p className="text-sm text-gray-600">{customer.phone || '-'}</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={e => handleNewQuoteClick(e, customer.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors min-h-[44px]"
                    title="Novo Orçamento">
                    <PlusCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">Orçamento</span>
                  </button>
                  <button
                    onClick={e => handleNewMessageClick(e, customer.phone || '')}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors min-h-[44px]"
                    title="WhatsApp">
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">WhatsApp</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
