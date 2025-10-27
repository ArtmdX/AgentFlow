import { Suspense } from 'react';
import StatsCards from '@/components/dashboard/StatsCards';
import RecentTravels from '@/components/dashboard/RecentTravels';
import QuickActions from '@/components/dashboard/QuickActions';
import { CardSkeleton } from '@/components/ui/Loading';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Visão geral do seu negócio</p>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-3 gap-6">{[1, 2, 3].map(i => <CardSkeleton key={i} />)}</div>}>
        <StatsCards />
      </Suspense>

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Travels */}
      <Suspense fallback={<CardSkeleton />}>
        <RecentTravels />
      </Suspense>
    </div>
  );
}
