'use client';

import { useForm, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { CityAutocomplete } from '@/components/ui/CityAutocomplete';
import { Travel } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { createTravel } from '@/services/travelClientService';
import { useState } from 'react';

interface TravelFormProps {
  customerId: string; // Recebe o ID do cliente para vincular a viagem
}

// Define um tipo para os dados do formulário, com datas como string
type TravelFormData = Omit<Travel, 'departureDate' | 'returnDate'> & {
  departureDate: string;
  returnDate: string;
};

export function TravelForm({ customerId }: TravelFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<TravelFormData>();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: TravelFormData) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const dataForApi: Record<string, unknown> = {
        title: data.title,
        destination: data.destination,
        departureCity: data.departureCity,
        departureDate: data.departureDate,
        returnDate: data.returnDate || undefined,
        totalValue: data.totalValue ? parseFloat(data.totalValue.toString()) : undefined,
        customerId,
      };

      await createTravel(dataForApi as Partial<Travel>);
      router.push(`/dashboard/customers/${customerId}`);
      router.refresh();
    } catch (error: unknown) {
      setApiError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium leading-6 text-gray-900 border-b pb-4">Detalhes do Orçamento/Viagem</h3>
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              label="Título da Viagem *"
              {...register('title', { required: 'Título é obrigatório' })}
              error={errors.title?.message}
            />
          </div>
          <div className="sm:col-span-1">
            <Controller
              name="departureCity"
              control={control}
              rules={{ required: 'Cidade de partida é obrigatória' }}
              render={({ field }) => (
                <CityAutocomplete
                  label="Cidade de Partida *"
                  value={field.value || ''}
                  onChange={field.onChange}
                  error={errors.departureCity?.message}
                  placeholder="Ex: GRU - São Paulo/SP"
                  required
                />
              )}
            />
          </div>
          <div className="sm:col-span-1">
            <Controller
              name="destination"
              control={control}
              rules={{ required: 'Cidade de destino é obrigatória' }}
              render={({ field }) => (
                <CityAutocomplete
                  label="Cidade de Destino *"
                  value={field.value || ''}
                  onChange={field.onChange}
                  error={errors.destination?.message}
                  placeholder="Ex: GIG - Rio de Janeiro/RJ"
                  required
                />
              )}
            />
          </div>
          <div className="sm:col-span-1">
            <Input
              label="Data de Partida *"
              type="date"
              {...register('departureDate', { required: 'Data de partida é obrigatória' })}
              error={errors.departureDate?.message}
            />
          </div>
          <div className="sm:col-span-1">
            <Input label="Data de Retorno" type="date" {...register('returnDate')} />
          </div>
          <div className="sm:col-span-1">
            <Input
              label="Valor Total (R$)"
              type="number"
              step="0.01"
              {...register('totalValue')}
              placeholder="Ex: 2500.50"
            />
          </div>
        </div>
      </div>

      {apiError && <div className="text-red-600 text-center">{apiError}</div>}

      <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-full sm:w-auto px-4 py-3 sm:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 min-h-[44px]">
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto px-4 py-3 sm:py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 disabled:opacity-50 min-h-[44px]">
          {isLoading ? 'Salvando...' : 'Salvar Orçamento'}
        </button>
      </div>
    </form>
  );
}
