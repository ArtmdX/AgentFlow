import Link from "next/link";
import { Users, MapPin, Calculator, CreditCard } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      title: "Nova Viagem",
      description: "Criar uma nova cotação ou viagem",
      href: "/dashboard/travels/new",
      icon: MapPin,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Novo Cliente",
      description: "Cadastrar um novo cliente",
      href: "/dashboard/customers/new",
      icon: Users,
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Ver Pagamentos",
      description: "Gerenciar todos os pagamentos",
      href: "/dashboard/payments",
      icon: CreditCard,
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "Ver Viagens",
      description: "Gerenciar todas as viagens",
      href: "/dashboard/travels",
      icon: Calculator,
      color: "bg-orange-500 hover:bg-orange-600",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
        <h3 className="text-base sm:text-lg font-medium text-gray-900">Ações Rápidas</h3>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                href={action.href}
                className="group relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 min-h-[72px]">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg text-white ${action.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700">{action.title}</p>
                    <p className="text-xs text-gray-500 truncate">{action.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
