'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Importando o hook de roteamento
import { MessageCircle, PlusCircle } from 'lucide-react'; // Importando um ícone para o botão
import { Customer } from '@prisma/client';

interface CustomerTableProps {
  initialCustomers: Customer[];
}

export function CustomerTable({ initialCustomers }: CustomerTableProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [customers, setCustomers] = useState(initialCustomers);
  const router = useRouter(); // Inicializando o router

  // Função para lidar com o clique no botão de novo orçamento
  const handleNewQuoteClick = (e: React.MouseEvent, customerId: string) => {
    e.stopPropagation();

    // 2. Redireciona para a futura página de novo orçamento, passando o ID do cliente
    // router.push(`/travels/new?customerId=${customerId}`);
    console.log(`Criar novo orçamento para o cliente: ${customerId}`);
    // Descomentar a linha acima quando a página de viagens estiver pronta.
  };

  const handleNewMessageClick = (e: React.MouseEvent, customerPhone: string | null) => {
    // 1. Impede que o clique se propague para a linha da tabela
    e.stopPropagation();

    if (!customerPhone) {
      console.error('Número de telefone do cliente não disponível.');
      return;
    }

    const whatsappUrl = `https://wa.me/${customerPhone}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      {customers.length === 0 ? (
        <p className="text-center text-gray-500 p-6">Nenhum cliente encontrado.</p>
      ) : (
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
      )}
    </div>
  );
}
