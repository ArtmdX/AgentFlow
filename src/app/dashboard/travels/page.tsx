import { TravelTable } from '@/components/travels/TravelTable';
import { getTravels } from '@/services/travelServerService';

export default async function TravelsPage() {
  const travels = await getTravels();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Minhas Viagens</h2>
        <p className="text-gray-600">Gerencie todos os seus orçamentos e viagens confirmadas.</p>
      </div>
      <TravelTable travels={travels} />
    </div>
  );
}
