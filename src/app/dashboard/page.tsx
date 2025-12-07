'use client';

import { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import StatsCards from '@/components/dashboard/StatsCards';
import RecentTravels from '@/components/dashboard/RecentTravels';
import QuickActions from '@/components/dashboard/QuickActions';
import Sales12MonthsChart from '@/components/dashboard/Sales12MonthsChart';
import TopCustomers from '@/components/dashboard/TopCustomers';
import TopDestinations from '@/components/dashboard/TopDestinations';
import UpcomingDepartures from '@/components/dashboard/UpcomingDepartures';
import { AlertsDashboard } from '@/components/alerts/AlertsDashboard';
import { CardSkeleton } from '@/components/ui/Loading';

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard/stats');
      if (!res.ok) throw new Error('Erro ao carregar estatísticas');
      return res.json();
    }
  });

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

      {/* Alerts Dashboard */}
      <AlertsDashboard />

      {/* Charts and Analytics */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : stats ? (
        <>
          {/* 12 Months Sales Chart */}
          <Sales12MonthsChart data={stats.monthlyData || []} />

          {/* Top Customers and Top Destinations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopCustomers customers={stats.topCustomers || []} />
            <TopDestinations destinations={stats.topDestinations || []} />
          </div>

          {/* Upcoming Departures */}
          <UpcomingDepartures departures={stats.upcomingDepartures || []} />
        </>
      ) : null}

      {/* Recent Travels */}
      <Suspense fallback={<CardSkeleton />}>
        <RecentTravels />
      </Suspense>
    </div>
  );
}
