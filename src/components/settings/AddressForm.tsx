'use client';

/**
 * AddressForm Component
 * Form for agency address information
 */

import { MapPin } from 'lucide-react';

interface AddressFormProps {
  data: any;
  onChange: (field: string, value: any) => void;
}

export default function AddressForm({ data, onChange }: AddressFormProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b">
        <MapPin className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Endereço</h3>
      </div>

      {/* Street */}
      <div>
        <label htmlFor="addressStreet" className="block text-sm font-medium text-gray-700 mb-2">
          Logradouro
        </label>
        <input
          type="text"
          id="addressStreet"
          value={data.addressStreet || ''}
          onChange={(e) => onChange('addressStreet', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Rua, Avenida, etc."
        />
      </div>

      {/* Number and Complement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="addressNumber" className="block text-sm font-medium text-gray-700 mb-2">
            Número
          </label>
          <input
            type="text"
            id="addressNumber"
            value={data.addressNumber || ''}
            onChange={(e) => onChange('addressNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="123"
          />
        </div>

        <div>
          <label htmlFor="addressComplement" className="block text-sm font-medium text-gray-700 mb-2">
            Complemento
          </label>
          <input
            type="text"
            id="addressComplement"
            value={data.addressComplement || ''}
            onChange={(e) => onChange('addressComplement', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Sala, Andar, etc."
          />
        </div>
      </div>

      {/* Neighborhood */}
      <div>
        <label htmlFor="addressNeighborhood" className="block text-sm font-medium text-gray-700 mb-2">
          Bairro
        </label>
        <input
          type="text"
          id="addressNeighborhood"
          value={data.addressNeighborhood || ''}
          onChange={(e) => onChange('addressNeighborhood', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Centro, Jardim, etc."
        />
      </div>

      {/* City and State */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="addressCity" className="block text-sm font-medium text-gray-700 mb-2">
            Cidade
          </label>
          <input
            type="text"
            id="addressCity"
            value={data.addressCity || ''}
            onChange={(e) => onChange('addressCity', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="São Paulo"
          />
        </div>

        <div>
          <label htmlFor="addressState" className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <input
            type="text"
            id="addressState"
            value={data.addressState || ''}
            onChange={(e) => onChange('addressState', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="SP"
          />
        </div>
      </div>

      {/* ZIP Code and Country */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="addressZipCode" className="block text-sm font-medium text-gray-700 mb-2">
            CEP
          </label>
          <input
            type="text"
            id="addressZipCode"
            value={data.addressZipCode || ''}
            onChange={(e) => onChange('addressZipCode', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="12345-678"
          />
        </div>

        <div>
          <label htmlFor="addressCountry" className="block text-sm font-medium text-gray-700 mb-2">
            País
          </label>
          <input
            type="text"
            id="addressCountry"
            value={data.addressCountry || 'Brasil'}
            onChange={(e) => onChange('addressCountry', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Brasil"
          />
        </div>
      </div>
    </div>
  );
}
