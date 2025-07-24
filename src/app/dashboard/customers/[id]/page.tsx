import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getCustomerById } from '@/services/customerService';
import { User, Mail, Phone, MapPin } from 'lucide-react';

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  const costumerId: string = id;

  if (!session?.user.id) {
    window.location.href = '/auth/login';
  }

  const customer = await getCustomerById(costumerId);

  // Se o cliente não for encontrado (ou não pertencer ao usuário), exibe uma página 404.
  if (!customer) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 bg-gray-200 rounded-full h-16 w-16 flex items-center justify-center">
            <User className="h-8 w-8 text-gray-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{`${customer.firstName} ${customer.lastName}`}</h1>
            <p className="text-gray-600">{customer.email || 'Email não cadastrado'}</p>
          </div>
        </div>
      </div>

      {/* Card de Informações de Contato e Documentos */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-4">Detalhes do Cliente</h3>
        <dl className="mt-6 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <InfoField icon={Mail} label="Email" value={customer.email} />
          <InfoField icon={Phone} label="Telefone" value={customer.phone} />
          <InfoField label="Tipo de Documento" value={customer.documentType} />
          <InfoField label="Número do Documento" value={customer.documentNumber} />
          <InfoField label="Gênero" value={customer.gender} />
        </dl>
      </div>

      {/* Card de Endereço */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-4">Endereço</h3>
        <dl className="mt-6 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <InfoField
            icon={MapPin}
            label="Endereço"
            value={`${customer.addressStreet || ''}, ${customer.addressNumber || ''}`}
          />
          <InfoField label="Bairro" value={customer.addressNeighborhood} />
          <InfoField label="Cidade" value={customer.addressCity} />
          <InfoField label="Estado" value={customer.addressState} />
          <InfoField label="CEP" value={customer.addressZipCode} />
        </dl>
      </div>

      {/* Seção Futura para Viagens e Orçamentos */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900">Histórico de Viagens e Orçamentos</h3>
        <div className="mt-6 text-center text-gray-500">
          <p>Esta seção exibirá a lista de viagens e orçamentos associados a este cliente.</p>
          <p>(Funcionalidade a ser implementada)</p>
        </div>
      </div>
    </div>
  );
}

function InfoField({
  label,
  value,
  icon: Icon
}: {
  label: string;
  value: string | null | undefined;
  icon?: React.ElementType;
}) {
  if (!value) return null; // Não renderiza nada se o valor não existir

  return (
    <div className="sm:col-span-1">
      <dt className="text-sm font-medium text-gray-500 flex items-center">
        {Icon && <Icon className="h-4 w-4 mr-2" />}
        {label}
      </dt>
      <dd className="mt-1 text-sm text-gray-900">{value}</dd>
    </div>
  );
}
