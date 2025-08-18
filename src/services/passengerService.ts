import { Passenger } from '@prisma/client';

/**
 * Cria um ou mais passageiros para uma viagem específica.
 * @param travelId O ID da viagem à qual os passageiros serão associados.
 * @param passengers Um array com os dados dos passageiros a serem criados.
 * @returns Um array com os passageiros recém-criados.
 */
export async function createPassengers(
  travelId: string,
  passengers: Omit<Passenger, 'id' | 'agentId'>[]
): Promise<Passenger[]> {
  const response = await fetch(`/api/travels/${travelId}/passengers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(passengers)
  });

  if (!response.ok) {
    const errorResult = await response.json();
    throw new Error(errorResult.message || 'Falha ao adicionar passageiros.');
  }

  return response.json();
}
