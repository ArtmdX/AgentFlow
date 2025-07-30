import { headers } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getTravels() {
  try {
    const requestHeaders = await headers();

    const response = await fetch(`${API_BASE_URL}/travels`, {
      cache: 'no-cache',
      headers: requestHeaders
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro no travelServerService:', error);
    return [];
  }
}

export async function getTravelById(travelId: string) {
  try {
    const requestHeaders = await headers();
    const response = await fetch(`${API_BASE_URL}/travels/${travelId}`, {
      cache: 'no-cache',
      headers: requestHeaders
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro no travelServerService ao buscar por ID:', error);
    return null;
  }
}
