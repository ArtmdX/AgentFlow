import { ViaCEPResponse } from '@/types/api';

export async function getAddressByCEP(cep: string): Promise<ViaCEPResponse | null> {
  // Remove qualquer caractere que não seja número
  const cleanedCep = cep.replace(/\D/g, '');

  if (cleanedCep.length !== 8) {
    return null;
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
    const data: ViaCEPResponse = await response.json();

    if (data.erro) {
      console.error('CEP não encontrado.');
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    return null;
  }
}
