'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Plane, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}

export function MobileBottomNav() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { icon: Home, label: 'Início', href: '/dashboard' },
    { icon: Users, label: 'Clientes', href: '/dashboard/customers' },
    { icon: Plane, label: 'Viagens', href: '/dashboard/travels' },
    { icon: CreditCard, label: 'Pagamentos', href: '/dashboard/payments' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-inset-bottom">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center px-3 py-2 min-w-[64px] min-h-[56px] rounded-md transition-colors',
                isActive
                  ? 'text-indigo-600'
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
              )}
            >
              <Icon className={cn('w-6 h-6 mb-1', isActive && 'text-indigo-600')} />
              <span className={cn('text-xs font-medium', isActive && 'text-indigo-600')}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
