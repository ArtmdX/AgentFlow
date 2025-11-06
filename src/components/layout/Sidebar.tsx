"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Users, Plane, CreditCard, BarChart3, Settings, UserCog, UserCircle } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { Permission } from "@/lib/permissions";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: Permission;
}

export function Sidebar() {
  const pathname = usePathname();
  const { checkPermission } = usePermissions();

  const navigation: NavigationItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Clientes", href: "/dashboard/customers", icon: Users },
    { name: "Viagens", href: "/dashboard/travels", icon: Plane },
    { name: "Pagamentos", href: "/dashboard/payments", icon: CreditCard },
    { name: "Relatórios", href: "/dashboard/reports", icon: BarChart3 },
    {
      name: "Usuários",
      href: "/dashboard/users",
      icon: UserCog,
      permission: Permission.VIEW_USERS
    },
    { name: "Perfil", href: "/dashboard/profile", icon: UserCircle },
    { name: "Configurações", href: "/dashboard/settings", icon: Settings },
  ];

  // Filtrar itens baseado em permissões
  const visibleNavigation = navigation.filter((item) => {
    if (!item.permission) return true;
    return checkPermission(item.permission);
  });

  return (
    <div className="flex flex-col w-64 bg-gray-50 border-r border-gray-200">
      <div className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {visibleNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive ? "text-indigo-500 hover:bg-indigo-100" : "text-gray-700 hover:bg-indigo-100"
                )}>
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
