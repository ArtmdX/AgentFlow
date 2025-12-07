'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { getAddressByCEP } from '@/services/cepService';
import { Customer } from '@prisma/client';
import { Textarea } from '@/components/ui/TextArea';
import { CustomerFormData } from '@/types/database';
import { ApiErrorDisplay } from '@/components/error/ApiErrorDisplay';
import { ErrorResponse } from '@/lib/error-handler';
import { validateCPFOrCNPJ, formatCPF, formatCNPJ, formatPhone, formatCEP } from '@/lib/validations/validators';
import { DuplicateWarningModal } from '@/components/ui/DuplicateWarningModal';
import { useCheckDuplicates } from '@/hooks/useCheckDuplicates';
import { AlertCircle } from 'lucide-react';

interface Duplicate {
  field: string;
  value: string;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
    documentNumber: string | null;
  };
}

interface CustomerFormProps {
  onSubmit: (data: Customer, override?: boolean) => void;
  isLoading: boolean;
  initialData?: Partial<CustomerFormData>;
  submitButtonText?: string;
  onCancel: () => void;
  error?: ErrorResponse | null;
  onClearError?: () => void;
}

export function CustomerForm({
  onSubmit,
  isLoading,
  initialData = {},
  submitButtonText = 'Salvar',
  onCancel,
  error,
  onClearError
}: CustomerFormProps) {
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [detectedDuplicates, setDetectedDuplicates] = useState<Duplicate[]>([]);
  const [pendingData, setPendingData] = useState<Customer | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CustomerFormData>({
    defaultValues: initialData,
  });

  // Watch email and documentNumber for real-time duplicate checking
  const watchEmail = watch('email');
  const watchDocumentNumber = watch('documentNumber');

  // Use the duplicate checking hook with debounce
  const { duplicates: realtimeDuplicates, isChecking } = useCheckDuplicates({
    email: watchEmail || undefined,
    documentNumber: watchDocumentNumber || undefined,
    excludeId: initialData.id,
    debounceMs: 800,
  });

  const handleCepBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    const cep = event.target.value;
    const addressData = await getAddressByCEP(cep);

    if (addressData) {
      setValue('addressStreet', addressData.logradouro, { shouldValidate: true });
      setValue('addressCity', addressData.localidade, { shouldValidate: true });
      setValue('addressState', addressData.uf, { shouldValidate: true });
      setValue('addressNeighborhood', addressData.bairro, { shouldValidate: true });
    }
  };

  const handleDocumentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const cleanValue = value.replace(/\D/g, '');

    let formattedValue = value;

    // Aplica formatação baseado no tamanho
    if (cleanValue.length <= 11) {
      // CPF: 000.000.000-00
      formattedValue = formatCPF(cleanValue);
    } else if (cleanValue.length <= 14) {
      // CNPJ: 00.000.000/0000-00
      formattedValue = formatCNPJ(cleanValue);
    }

    setValue('documentNumber', formattedValue, { shouldValidate: true });
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const formattedValue = formatPhone(value);
    setValue('phone', formattedValue, { shouldValidate: true });
  };

  const handleCepChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const formattedValue = formatCEP(value);
    setValue('addressZipCode', formattedValue, { shouldValidate: true });
  };

  const handleFormSubmit = (data: CustomerFormData) => {
    const apiData = {
      ...data,
      birthDate: data.birthDate ? new Date(data.birthDate) : null
    };

    // Check if there are real-time duplicates detected
    if (realtimeDuplicates.length > 0) {
      // Show modal for user confirmation
      setDetectedDuplicates(realtimeDuplicates);
      setPendingData(apiData as unknown as Customer);
      setShowDuplicateModal(true);
    } else {
      // No duplicates, proceed with submission
      onSubmit(apiData as unknown as Customer);
    }
  };

  const handleOverrideDuplicates = () => {
    // User confirmed to save anyway, proceed with submission with override flag
    setShowDuplicateModal(false);
    if (pendingData) {
      onSubmit(pendingData, true); // Pass override = true
    }
    setPendingData(null);
    setDetectedDuplicates([]);
  };

  const handleCloseDuplicateModal = () => {
    setShowDuplicateModal(false);
    setPendingData(null);
    setDetectedDuplicates([]);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Exibir erro de API se houver */}
      {error && (
        <ApiErrorDisplay
          error={error}
          onDismiss={onClearError}
        />
      )}

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
            {isChecking && watchEmail && (
              <p className="mt-1 text-xs text-gray-500">Verificando duplicatas...</p>
            )}
            {!isChecking && realtimeDuplicates.some(d => d.field === 'email') && (
              <div className="mt-1 flex items-center text-xs text-yellow-600">
                <AlertCircle className="h-3 w-3 mr-1" />
                Email já cadastrado
              </div>
            )}
          </div>

          <div className="sm:col-span-2">
            <Input
              label="Telefone *"
              type="tel"
              placeholder="(00) 00000-0000"
              {...register('phone', {
                required: 'O telefone é obrigatório',
                onChange: handlePhoneChange
              })}
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
            <Select label="Tipo de Documento" {...register('documentType')}>
              <option value="cpf">CPF</option>
              <option value="passport">Passaporte</option>
              <option value="rg">RG</option>
              <option value="cnpj">CNPJ</option>
            </Select>
          </div>

          <div className="sm:col-span-2">
            <Input
              label="Número do Documento"
              {...register('documentNumber', {
                onChange: handleDocumentChange,
                validate: (value) => {
                  if (!value || value.trim() === '') return true;
                  return validateCPFOrCNPJ(value) || 'CPF ou CNPJ inválido';
                },
              })}
              error={errors.documentNumber?.message}
            />
            {isChecking && watchDocumentNumber && (
              <p className="mt-1 text-xs text-gray-500">Verificando duplicatas...</p>
            )}
            {!isChecking && realtimeDuplicates.some(d => d.field === 'documentNumber') && (
              <div className="mt-1 flex items-center text-xs text-yellow-600">
                <AlertCircle className="h-3 w-3 mr-1" />
                CPF/CNPJ já cadastrado
              </div>
            )}
          </div>

          <div className="sm:col-span-1">
            <Input
              label="Data de nascimento"
              type="date"
              {...register('birthDate')}
              error={errors.birthDate?.message}
            />
          </div>

          <div className="sm:col-span-1">
            <Select label="Gênero" {...register('gender')}>
              <option value="M">M</option>
              <option value="F">F</option>
              <option value="other">Outro</option>
            </Select>
          </div>

          <div className="sm:col-span-1">
            <Input
              label="CEP"
              placeholder="00000-000"
              {...register('addressZipCode', {
                onChange: handleCepChange
              })}
              onBlur={handleCepBlur}
            />
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

          <div className="sm:col-span-6">
            <Textarea label="Observações" {...register('notes')} />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto px-4 py-3 sm:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 cursor-pointer min-h-[44px]">
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto px-4 py-3 sm:py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 disabled:opacity-50 cursor-pointer min-h-[44px]">
          {isLoading ? 'Salvando...' : submitButtonText}
        </button>
      </div>

      {/* Modal de aviso de duplicatas */}
      <DuplicateWarningModal
        isOpen={showDuplicateModal}
        duplicates={detectedDuplicates}
        onClose={handleCloseDuplicateModal}
        onOverride={handleOverrideDuplicates}
      />
    </form>
  );
}
