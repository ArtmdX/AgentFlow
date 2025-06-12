'use client';

import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { User, LogOut } from 'lucide-react';

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AgentFlow CRM</h1>
          <p className="text-sm text-gray-600">Sistema de Gestão de Viagens</p>
        </div>

        {session && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-700">{session.user?.name || session.user?.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut()}
              className="flex items-center space-x-2 cursor-pointer">
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
