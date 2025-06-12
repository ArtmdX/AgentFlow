export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Visão geral do seu negócio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Orçamentos</h3>
          <p className="text-3xl font-bold text-blue-600">12</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Confirmadas</h3>
          <p className="text-3xl font-bold text-green-600">8</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Clientes</h3>
          <p className="text-3xl font-bold text-purple-600">45</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Receita</h3>
          <p className="text-3xl font-bold text-green-600">R$ 25.000</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Atividades Recentes</h3>
        <div className="space-y-3">
          <p className="text-gray-600">Sistema configurado e funcionando!</p>
          <p className="text-gray-600">Pronto para começar a cadastrar clientes e viagens.</p>
        </div>
      </div>
    </div>
  );
}
