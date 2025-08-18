'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { document_type, gender_type, Passenger } from '@prisma/client';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { createPassengers } from '@/services/passengerService';
import { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface PassengersSectionProps {
  travelId: string;
  existingPassengers: Passenger[];
}

// MUDANÇA 1: O tipo do formulário reflete a realidade dos inputs (data como string)
type PassengerFormValues = {
  firstName: string;
  lastName: string;
  birthDate: string; // Datas em formulários HTML são strings
  documentType: document_type;
  documentNumber: string;
  gender: gender_type;
};

type PassengerFormData = {
  passengers: PassengerFormValues[];
};

// MUDANÇA 2: Um objeto mais limpo para os valores padrão de um novo passageiro
const defaultPassengerValues: PassengerFormValues = {
  firstName: '',
  lastName: '',
  birthDate: '',
  documentType: 'cpf',
  documentNumber: '',
  gender: 'M'
};

export function PassengersSection({ travelId, existingPassengers }: PassengersSectionProps) {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PassengerFormData>({
    defaultValues: {
      passengers: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'passengers'
  });

  // MUDANÇA 3: A função onSubmit agora converte os dados antes de enviar
  const onSubmit = async (data: PassengerFormData) => {
    if (data.passengers.length === 0) {
      setApiError('Adicione pelo menos um passageiro.');
      return;
    }

    setIsLoading(true);
    setApiError(null);
    try {
      // Converte os dados do formulário para o formato que a API espera
      const passengersForApi = data.passengers.map(p => ({
        ...p,
        birthDate: new Date(p.birthDate),
        travelId: travelId,
        isPrimary: false,
        createdAt: null
      }));

      await createPassengers(travelId, passengersForApi);
      toast.success('Passageiros adicionados com sucesso!');
      router.refresh();
    } catch (error: any) {
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      <h3 className="text-lg font-medium border-b pb-4 text-gray-900">Passageiros</h3>

      {existingPassengers.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-600">Passageiros já cadastrados:</h4>
          <ul className="list-disc pl-5 text-gray-800">
            {existingPassengers.map(p => (
              <li key={p.id}>
                {p.firstName} {p.lastName}
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((field, index) => (
          // MUDANÇA 4: Layout ajustado para caber todos os campos obrigatórios
          <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-6 border-b pb-6">
            {/* Linha 1: Nome e Sobrenome */}
            <div className="md:col-span-3">
              <Input label="Nome *" {...register(`passengers.${index}.firstName`, { required: true })} />
            </div>
            <div className="md:col-span-3">
              <Input label="Sobrenome *" {...register(`passengers.${index}.lastName`, { required: true })} />
            </div>
            <div className="md:col-span-3">
              <Input
                label="Data de Nasc. *"
                type="date"
                {...register(`passengers.${index}.birthDate`, { required: true })}
              />
            </div>
            <div className="md:col-span-3">
              <Select label="Gênero" {...register(`passengers.${index}.gender`)}>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </Select>
            </div>

            {/* Linha 2: Documentos e Ação de Remover */}
            <div className="md:col-span-1">
              <Select label="Doc *" {...register(`passengers.${index}.documentType`, { required: true })}>
                <option value="cpf">CPF</option>
                <option value="rg">RG</option>
                <option value="passport">Passaporte</option>
              </Select>
            </div>
            <div className="md:col-span-3">
              <Input
                label="Número do Documento *"
                {...register(`passengers.${index}.documentNumber`, { required: true })}
              />
            </div>
            <div className="md:col-span-1 flex items-end justify-start">
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-2 text-red-500 hover:bg-red-100 rounded-full cursor-pointer">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center pt-4">
          <button
            type="button"
            onClick={() => append(defaultPassengerValues)}
            className="flex items-center space-x-2 text-sm font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
            <PlusCircle className="h-5 w-5" />
            <span>Adicionar Passageiro</span>
          </button>

          {fields.length > 0 && (
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 disabled:opacity-50 cursor-pointer">
              {isLoading ? 'Salvando...' : 'Salvar Passageiros'}
            </button>
          )}
        </div>
        {apiError && <p className="text-sm text-red-600 text-center mt-2">{apiError}</p>}
      </form>
    </div>
  );
}
