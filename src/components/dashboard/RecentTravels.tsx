"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, Calendar, MapPin } from "lucide-react";
import { TableSkeleton } from "@/components/ui/Loading";

interface RecentTravel {
  id: string;
  title: string;
  customer: string;
  destination: string;
  departureDate: string;
  status: string;
  totalValue: number;
}

export default function RecentTravels() {
  const [travels, setTravels] = useState<RecentTravel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecentTravels();
  }, []);

  const fetchRecentTravels = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/dashboard/stats");
      if (!response.ok) {
        throw new Error("Erro ao carregar viagens recentes");
      }
      const data = await response.json();
      setTravels(data.recentTravels);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      orcamento: "bg-gray-100 text-gray-800",
      aguardando_pagamento: "bg-yellow-100 text-yellow-800",
      confirmada: "bg-green-100 text-green-800",
      em_andamento: "bg-blue-100 text-blue-800",
      finalizada: "bg-purple-100 text-purple-800",
      cancelada: "bg-red-100 text-red-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
      orcamento: "Orçamento",
      aguardando_pagamento: "Aguardando Pagamento",
      confirmada: "Confirmada",
      em_andamento: "Em Andamento",
      finalizada: "Finalizada",
      cancelada: "Cancelada",
    };
    return statusLabels[status] || status;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Viagens Recentes</h3>
        </div>
        <div className="p-6">
          <TableSkeleton rows={5} cols={5} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Viagens Recentes</h3>
        </div>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Erro: {error}</p>
            <button onClick={fetchRecentTravels} className="mt-2 text-sm text-red-700 hover:text-red-900 underline">
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Viagens Recentes</h3>
        <Link href="/dashboard/travels" className="text-sm text-primary-600 hover:text-primary-500">
          Ver todas
        </Link>
      </div>

      {travels.length === 0 ? (
        <div className="p-6 text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Nenhuma viagem encontrada</p>
          <Link href="/dashboard/travels/new" className="mt-2 inline-block text-primary-600 hover:text-primary-500">
            Criar primeira viagem
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Viagem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Destino
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {travels.map((travel) => (
                <tr key={travel.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{travel.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{travel.customer}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{travel.destination}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      {formatDate(travel.departureDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        travel.status
                      )}`}>
                      {getStatusLabel(travel.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(Number(travel.totalValue) || 0)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/dashboard/travels/${travel.id}`} className="text-primary-600 hover:text-primary-900">
                      <Eye className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
