'use client';

import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { User, LogOut, Menu } from 'lucide-react';
import GlobalSearch from '@/components/search/GlobalSearch';
import { NotificationBell } from '@/components/notifications/NotificationBell';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Left side: Hamburger + Title */}
        <div className="flex items-center gap-3">
          {/* Hamburger Menu - Mobile only */}
          {session && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Abrir menu"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          )}

          {/* Title */}
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">AgentFlow CRM</h1>
            <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Sistema de Gestão de Viagens</p>
          </div>
        </div>

        {/* Right side: Search, Notifications, User, Logout */}
        {session && (
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Global Search - Hidden on very small screens */}
            <div className="hidden md:block">
              <GlobalSearch />
            </div>

            {/* Notifications */}
            <NotificationBell />

            {/* User Info - Hidden on small screens */}
            <div className="hidden md:flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-700">{session.user?.name || session.user?.email}</span>
            </div>

            {/* Logout Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut()}
              className="flex items-center space-x-2 cursor-pointer min-h-[44px]">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
