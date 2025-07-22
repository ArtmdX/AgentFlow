'use client';

import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { getAddressByCEP } from '@/services/cepService';
import { Customer } from '@prisma/client';

interface CustomerFormProps {
  onSubmit: (data: Customer) => void;
  isLoading: boolean;
  initialData?: Partial<Customer>;
  submitButtonText?: string;
  onCancel: () => void;
}

export function CustomerForm({
  onSubmit,
  isLoading,
  initialData = {},
  submitButtonText = 'Salvar',
  onCancel
}: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<Customer>({
    defaultValues: initialData
  });

  const handleCepBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    const cep = event.target.value;
    const addressData = await getAddressByCEP(cep);

    if (addressData) {
      setValue('addressStreet', addressData.logradouro, { shouldValidate: true });
      setValue('addressCity', addressData.localidade, { shouldValidate: true });
      setValue('addressState', addressData.uf, { shouldValidate: true });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Seção de Dados Obrigatórios */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium leading-6 text-gray-900 border-b pb-4">Dados Obrigatórios</h3>
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <Input
              label="Nome *"
              {...register('firstName', { required: 'O nome é obrigatório' })}
              error={errors.firstName?.message}
            />
          </div>

          <div className="sm:col-span-3">
            <Input
              label="Sobrenome *"
              {...register('lastName', { required: 'O sobrenome é obrigatório' })}
              error={errors.lastName?.message}
            />
          </div>

          <div className="sm:col-span-4">
            <Input
              label="E-mail *"
              type="email"
              {...register('email', { required: 'O e-mail é obrigatório' })}
              error={errors.email?.message}
            />
          </div>

          <div className="sm:col-span-2">
            <Input
              label="Telefone *"
              type="tel"
              {...register('phone', { required: 'O telefone é obrigatório' })}
              error={errors.phone?.message}
            />
          </div>
        </div>
      </div>

      {/* Seção de Informações Adicionais */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium leading-6 text-gray-900 border-b pb-4">Informações Adicionais (Opcional)</h3>
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-1">
            <Select label="Tipo de Documento" {...register('documentType', { required: true })}>
              <option value="cpf">CPF</option>
              <option value="passport">Passaporte</option>
              <option value="rg">RG</option>
              <option value="cnpj">CNPJ</option>
            </Select>
          </div>

          <div className="sm:col-span-2">
            <Input
              label="Número do Documento"
              {...register('documentNumber', { required: 'O número do documento é obrigatório' })}
              error={errors.documentNumber?.message}
            />
          </div>

          <div className="sm:col-span-1">
            <Input label="CEP" {...register('addressZipCode')} onBlur={handleCepBlur} placeholder="Digite o CEP" />
          </div>

          <div className="sm:col-span-4">
            <Input label="Endereço (Rua, Av.)" {...register('addressStreet')} />
          </div>

          <div className="sm:col-span-2">
            <Input label="Número" {...register('addressNumber')} />
          </div>

          <div className="sm:col-span-2">
            <Input label="Bairro" {...register('addressNeighborhood')} />
          </div>

          <div className="sm:col-span-2">
            <Input label="Cidade" {...register('addressCity')} />
          </div>

          <div className="sm:col-span-2">
            <Input label="Estado" {...register('addressState')} />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 cursor-pointer">
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 disabled:opacity-50 cursor-pointer">
          {isLoading ? 'Salvando...' : submitButtonText}
        </button>
      </div>
    </form>
  );
}
