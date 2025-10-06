import { getCustomers } from "@/services/customerServerService";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { PlusCircle, Users, MapPin, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  // 1. A chamada da API acontece no servidor, antes da página ser enviada para o browser.
  const { customers, stats } = await getCustomers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Clientes</h2>
          <p className="text-gray-600">Gerencie sua carteira de clientes.</p>
        </div>
        <div>
          <Link href="/dashboard/customers/new">
            <Button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer">
              <PlusCircle className="h-5 w-5" />
              <span>Adicionar Cliente</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-50">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-green-50">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Viagens</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTravels}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-purple-50">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Receita Total</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Passamos os dados já buscados como uma prop para o componente de tabela. */}
      <CustomerTable initialCustomers={customers} />
    </div>
  );
}
