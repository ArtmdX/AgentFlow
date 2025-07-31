import { getCustomers } from "@/services/customerServerService";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/Button"; // Supondo que você tenha um componente de botão
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  // 1. A chamada da API acontece no servidor, antes da página ser enviada para o browser.
  const customers = await getCustomers();

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

      {/* 2. Passamos os dados já buscados como uma prop para o componente de tabela. */}
      <CustomerTable initialCustomers={customers} />
    </div>
  );
}
