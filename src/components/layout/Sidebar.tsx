"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Users, Plane, CreditCard, BarChart3, Settings, UserCog, UserCircle, ChevronDown, ChevronRight } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { Permission } from "@/lib/permissions";
import { useState } from "react";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: Permission;
  children?: SubNavigationItem[];
}

interface SubNavigationItem {
  name: string;
  href: string;
  permission?: Permission;
}

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

export function Sidebar({ className, onClose }: SidebarProps = {}) {
  const pathname = usePathname();
  const { checkPermission } = usePermissions();
  const [reportsOpen, setReportsOpen] = useState(false);

  const navigation: NavigationItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Clientes", href: "/dashboard/customers", icon: Users },
    { name: "Viagens", href: "/dashboard/travels", icon: Plane },
    { name: "Pagamentos", href: "/dashboard/payments", icon: CreditCard },
    {
      name: "Relatórios",
      href: "/dashboard/reports",
      icon: BarChart3,
      children: [
        { name: "Vendas", href: "/dashboard/reports/sales" },
        { name: "Pagamentos", href: "/dashboard/reports/payments" },
        { name: "Auditoria", href: "/dashboard/reports/audit", permission: Permission.VIEW_AUDIT_LOG }
      ]
    },
    {
      name: "Usuários",
      href: "/dashboard/users",
      icon: UserCog,
      permission: Permission.VIEW_USERS
    },
    { name: "Perfil", href: "/dashboard/profile", icon: UserCircle },
    {
      name: "Configurações",
      href: "/dashboard/admin/settings",
      icon: Settings,
      permission: Permission.MANAGE_SETTINGS
    },
  ];

  // Filtrar itens baseado em permissões
  const visibleNavigation = navigation.filter((item) => {
    if (!item.permission) return true;
    return checkPermission(item.permission);
  });

  const handleLinkClick = () => {
    // Close mobile drawer when a link is clicked
    if (onClose) {
      onClose();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col w-64 bg-gray-50 border-r border-gray-200 h-full">
      <div className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {visibleNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);

            // Se o item tem filhos (dropdown)
            if (item.children) {
              return (
                <div key={item.name}>
                  <button
                    onClick={() => setReportsOpen(!reportsOpen)}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-3 text-sm font-medium rounded-md transition-colors min-h-[44px]",
                      isActive ? "text-indigo-500 hover:bg-indigo-100" : "text-gray-700 hover:bg-indigo-100"
                    )}
                  >
                    <div className="flex items-center">
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </div>
                    {reportsOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>

                  {reportsOpen && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children
                        .filter((child) => {
                          if (!child.permission) return true;
                          return checkPermission(child.permission);
                        })
                        .map((child) => {
                          const isChildActive = pathname === child.href;
                          return (
                            <Link
                              key={child.name}
                              href={child.href}
                              onClick={handleLinkClick}
                              className={cn(
                                "block px-3 py-3 text-sm rounded-md transition-colors min-h-[44px]",
                                isChildActive
                                  ? "text-indigo-600 font-medium bg-indigo-50"
                                  : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                              )}
                            >
                              {child.name}
                            </Link>
                          );
                        })}
                    </div>
                  )}
                </div>
              );
            }

            // Item normal sem filhos
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors min-h-[44px]",
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

  // Desktop: Static sidebar
  // Mobile: Render nothing (will be rendered in Drawer from layout)
  return (
    <>
      {/* Desktop Sidebar - Always visible on large screens */}
      <div className={cn("hidden lg:block", className)}>
        {sidebarContent}
      </div>
    </>
  );
}

// Component for mobile sidebar content (used in Drawer)
export function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { checkPermission } = usePermissions();
  const [reportsOpen, setReportsOpen] = useState(false);

  const navigation: NavigationItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Clientes", href: "/dashboard/customers", icon: Users },
    { name: "Viagens", href: "/dashboard/travels", icon: Plane },
    { name: "Pagamentos", href: "/dashboard/payments", icon: CreditCard },
    {
      name: "Relatórios",
      href: "/dashboard/reports",
      icon: BarChart3,
      children: [
        { name: "Vendas", href: "/dashboard/reports/sales" },
        { name: "Pagamentos", href: "/dashboard/reports/payments" },
        { name: "Auditoria", href: "/dashboard/reports/audit", permission: Permission.VIEW_AUDIT_LOG }
      ]
    },
    {
      name: "Usuários",
      href: "/dashboard/users",
      icon: UserCog,
      permission: Permission.VIEW_USERS
    },
    { name: "Perfil", href: "/dashboard/profile", icon: UserCircle },
    {
      name: "Configurações",
      href: "/dashboard/admin/settings",
      icon: Settings,
      permission: Permission.MANAGE_SETTINGS
    },
  ];

  const visibleNavigation = navigation.filter((item) => {
    if (!item.permission) return true;
    return checkPermission(item.permission);
  });

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="flex flex-col bg-gray-50 h-full">
      <div className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {visibleNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);

            if (item.children) {
              return (
                <div key={item.name}>
                  <button
                    onClick={() => setReportsOpen(!reportsOpen)}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-3 text-sm font-medium rounded-md transition-colors min-h-[44px]",
                      isActive ? "text-indigo-500 hover:bg-indigo-100" : "text-gray-700 hover:bg-indigo-100"
                    )}
                  >
                    <div className="flex items-center">
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </div>
                    {reportsOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>

                  {reportsOpen && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children
                        .filter((child) => {
                          if (!child.permission) return true;
                          return checkPermission(child.permission);
                        })
                        .map((child) => {
                          const isChildActive = pathname === child.href;
                          return (
                            <Link
                              key={child.name}
                              href={child.href}
                              onClick={handleLinkClick}
                              className={cn(
                                "block px-3 py-3 text-sm rounded-md transition-colors min-h-[44px]",
                                isChildActive
                                  ? "text-indigo-600 font-medium bg-indigo-50"
                                  : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                              )}
                            >
                              {child.name}
                            </Link>
                          );
                        })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors min-h-[44px]",
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
