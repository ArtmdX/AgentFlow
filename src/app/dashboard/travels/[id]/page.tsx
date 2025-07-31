import { notFound } from "next/navigation";
import { getTravelById } from "@/services/travelServerService";
import { User, Calendar, MapPin, DollarSign, Info } from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function TravelDetailPage(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const travel = await getTravelById(id);

  if (!travel) {
    notFound();
  }

  const { customer } = travel;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{travel.title}</h1>
        <p className="text-gray-600 text-lg">
          Viagem para <span className="font-semibold">{travel.destination}</span>
        </p>
      </div>

      {/* Card de Informações Principais */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-4">Detalhes da Viagem</h3>
        <dl className="mt-6 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3">
          <InfoField icon={Calendar} label="Data de Partida" value={formatDate(travel.departureDate)} />
          <InfoField icon={Calendar} label="Data de Retorno" value={formatDate(travel.returnDate)} />
          <InfoField icon={MapPin} label="Cidade de Partida" value={travel.departureCity} />
          <InfoField icon={DollarSign} label="Valor Total" value={formatCurrency(travel.totalValue)} />
          <InfoField
            icon={DollarSign}
            label="Valor Pago"
            value={formatCurrency(travel.paidValue)}
            color="text-green-600"
          />
          <InfoField icon={Info} label="Status" value={travel.status} />
        </dl>
      </div>

      {/* Card de Informações do Cliente */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="text-lg font-medium text-gray-900">Cliente Responsável</h3>
          <Link
            href={`/dashboard/customers/${customer.id}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Ver perfil completo
          </Link>
        </div>
        <dl className="mt-6 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <InfoField icon={User} label="Nome" value={`${customer.firstName} ${customer.lastName}`} />
          <InfoField label="Email" value={customer.email} />
          <InfoField label="Telefone" value={customer.phone} />
        </dl>
      </div>

      {/* Espaços futuros para Passageiros e Pagamentos */}
      <div className="p-4 border-2 border-dashed rounded-lg text-center">
        <h3 className="text-lg font-medium text-gray-900">Passageiros e Pagamentos</h3>
        <p className="mt-2 text-sm text-gray-500">(Área para funcionalidades futuras)</p>
      </div>
    </div>
  );
}

// Componente auxiliar para não repetir código
function InfoField({
  label,
  value,
  icon: Icon,
  color = "text-gray-900",
}: {
  label: string;
  value: string | null | undefined;
  icon?: React.ElementType;
  color?: string;
}) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-sm font-medium text-gray-500 flex items-center">
        {Icon && <Icon className="h-4 w-4 mr-2" />}
        {label}
      </dt>
      <dd className={`mt-1 text-sm font-semibold ${color}`}>{value}</dd>
    </div>
  );
}
