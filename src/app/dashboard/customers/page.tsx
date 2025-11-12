'use client';

import { useState } from "react";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { PlusCircle, Users, MapPin, DollarSign, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import Pagination from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Loading";
import { useCustomers } from "@/hooks/useCustomers";

export default function CustomersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [search, setSearch] = useState('');

  // Usando React Query
  const { data, isLoading, error } = useCustomers({ page, limit, search });

  const customers = data?.customers || [];
  const pagination = data?.pagination || { page: 1, limit: 25, total: 0, totalPages: 0 };
  const stats = data?.stats || { totalCustomers: 0, totalTravels: 0, totalRevenue: 0 };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setPage(1);
    setLimit(newLimit);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

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

      {/* Busca */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou documento..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabela */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow">
          <TableSkeleton rows={10} cols={5} />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">Erro ao carregar clientes. Tente novamente.</p>
        </div>
      ) : (
        <>
          <CustomerTable initialCustomers={customers} />
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </>
      )}
    </div>
  );
}
