import { Travel } from '@prisma/client';

export async function createTravel(travelData: Partial<Travel>): Promise<Travel> {
  const response = await fetch('/api/travels', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(travelData)
  });

  if (!response.ok) {
    const errorResult = await response.json();
    throw new Error(errorResult.message || 'Falha ao criar a viagem.');
  }
  return response.json();
}
