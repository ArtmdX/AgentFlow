'use client';

interface Customer {
  customerId: string;
  customerName: string;
  revenue: number;
  travelCount: number;
}

interface TopCustomersProps {
  customers: Customer[];
}

export default function TopCustomers({ customers }: TopCustomersProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Clientes</h3>
      <div className="space-y-3">
        {customers.map((customer, index) => (
          <div
            key={customer.customerId}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">{index + 1}</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{customer.customerName}</p>
                <p className="text-sm text-gray-600">{customer.travelCount} viagens</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-green-600">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(customer.revenue)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
