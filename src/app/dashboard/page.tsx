import StatsCards from '@/components/dashboard/StatsCards';
import RecentTravels from '@/components/dashboard/RecentTravels';
import QuickActions from '@/components/dashboard/QuickActions';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Visão geral do seu negócio</p>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Travels */}
      <RecentTravels />
    </div>
  );
}
