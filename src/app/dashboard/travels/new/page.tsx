import { notFound } from 'next/navigation';
import { getCustomerById } from '@/services/customerServerService';
import { TravelForm } from '@/components/forms/TravelForm';

interface NewTravelPageProps {
  searchParams: {
    customerId?: string;
  };
}

export default async function NewTravelPage({ searchParams }: NewTravelPageProps) {
  const { customerId } = searchParams;

  if (!customerId) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-900">ID do Cliente não fornecido</h2>
        <p className="text-gray-600">Por favor, inicie um novo orçamento a partir da página de um cliente.</p>
      </div>
    );
  }

  const customer = await getCustomerById(customerId);

  if (!customer) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Novo Orçamento/Viagem</h2>
        <p className="text-gray-600">
          Criando um novo registro para o cliente:
          <span className="font-semibold text-primary-600">{` ${customer.firstName} ${customer.lastName}`}</span>
        </p>
      </div>

      <TravelForm customerId={customer.id} />
    </div>
  );
}
