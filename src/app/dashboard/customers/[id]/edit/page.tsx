import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getCustomerById } from '@/services/customerServerService';
import { CustomerEditForm } from '@/components/forms/CustomerEditForm';
import { CustomerFormData } from '@/types/database';

function formatDateForInput(date: Date | null | undefined): string {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
}

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    notFound();
  }

  const customer = await getCustomerById(id);

  if (!customer) {
    notFound();
  }

  const initialData: CustomerFormData = {
    ...customer,
    birthDate: formatDateForInput(customer.birthDate),
    createdAt: customer.createdAt ? new Date(customer.createdAt).toISOString() : '',
    updatedAt: customer.updatedAt ? new Date(customer.updatedAt).toISOString() : '',
    email: customer.email ?? '',
    phone: customer.phone ?? ''
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Editar Cliente</h2>
        <p className="text-gray-600">Altere as informações do cliente abaixo.</p>
      </div>
      <CustomerEditForm customer={initialData} />
    </div>
  );
}
