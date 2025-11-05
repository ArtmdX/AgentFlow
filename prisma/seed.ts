import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o processo de seed...');

  // 1. LIMPEZA DO BANCO DE DADOS (em ordem de dependência)
  // Deleta "filhos" antes de "pais" para não violar as chaves estrangeiras.
  console.log('Limpando dados antigos...');
  await prisma.payment.deleteMany();
  await prisma.passenger.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.travel.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  // 2. CRIAÇÃO DOS USUÁRIOS (ADMIN, MANAGER, AGENTS)
  console.log('Criando usuários...');
  const hashedPassword = await bcrypt.hash('senha123', 10);

  // Criar ADMIN
  const admin = await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'Sistema',
      email: 'admin@agentflow.com',
      passwordHash: hashedPassword,
      role: 'admin',
      phone: '11999999999'
    }
  });
  console.log(`-> Admin criado: ${admin.email}`);

  // Criar MANAGER
  const manager = await prisma.user.create({
    data: {
      firstName: 'Gerente',
      lastName: 'Principal',
      email: 'manager@agentflow.com',
      passwordHash: hashedPassword,
      role: 'manager',
      phone: '11988888888'
    }
  });
  console.log(`-> Manager criado: ${manager.email}`);

  // Criar AGENTS
  const createdAgents = [];
  for (let i = 0; i < 3; i++) {
    const agent = await prisma.user.create({
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: `agent${i + 1}@agentflow.com`,
        passwordHash: hashedPassword,
        role: 'agent',
        phone: faker.phone.number()
      }
    });
    createdAgents.push(agent);
  }
  console.log(`-> ${createdAgents.length} agentes criados.`);

  // Adicionar admin e manager na lista de agentes para distribuir clientes
  const allUsers = [admin, manager, ...createdAgents];

  // 3. CRIAÇÃO DOS CLIENTES
  console.log('Criando clientes...');
  const createdCustomers = [];
  for (let i = 0; i < 15; i++) {
    const customer = await prisma.customer.create({
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email().toLowerCase(),
        phone: faker.string.numeric(11),
        documentType: 'cpf',
        documentNumber: faker.string.numeric(11),
        addressCity: faker.location.city(),
        addressState: faker.location.state({ abbreviated: true }),
        // Associa o cliente a um dos usuários criados de forma distribuída
        createdById: allUsers[i % allUsers.length].id
      }
    });
    createdCustomers.push(customer);
  }
  console.log(`-> ${createdCustomers.length} clientes criados.`);

  // 4. CRIAÇÃO DE VIAGENS, PASSAGEIROS E PAGAMENTOS
  console.log('Criando viagens, passageiros e pagamentos...');
  for (const customer of createdCustomers) {
    // Para cada cliente, vamos criar 1 ou 2 viagens
    const numberOfTravels = faker.number.int({ min: 1, max: 2 });

    for (let i = 0; i < numberOfTravels; i++) {
      const totalValue = faker.number.int({ min: 1500, max: 8000 });
      const departureDate = faker.date.soon({ days: 60 });

      // Cria a viagem associada ao cliente e a um agente
      const travel = await prisma.travel.create({
        data: {
          title: `Viagem para ${faker.location.city()}`,
          destination: faker.location.city(),
          departureCity: faker.location.city(),
          departureDate: departureDate,
          returnDate: faker.date.soon({ days: 10, refDate: departureDate }),
          totalValue: totalValue,
          status: 'orcamento',
          customerId: customer.id,
          agentId: allUsers[faker.number.int({ min: 0, max: allUsers.length - 1 })].id
        }
      });

      // Adiciona o próprio cliente como passageiro principal
      await prisma.passenger.create({
        data: {
          travelId: travel.id,
          agentId: travel.agentId,
          firstName: customer.firstName,
          lastName: customer.lastName,
          isPrimary: true,
          gender: 'M',
          birthDate: faker.date.birthdate(),
          documentNumber: faker.string.numeric(),
          documentType: 'cpf'
        }
      });

      // Cria um pagamento parcial para a viagem
      const paidAmount = faker.number.int({ min: 500, max: totalValue });
      await prisma.payment.create({
        data: {
          travelId: travel.id,
          amount: paidAmount,
          paymentDate: new Date(),
          paymentMethod: 'pix',
          createdById: travel.agentId
        }
      });

      // Atualiza o valor pago na viagem
      await prisma.travel.update({
        where: { id: travel.id },
        data: {
          paidValue: paidAmount,
          status: 'aguardando_pagamento'
        }
      });
    }
  }
  console.log(`-> Viagens, passageiros e pagamentos criados.`);

  console.log('\n========================================');
  console.log('Seed concluído com sucesso!');
  console.log('========================================');
  console.log('\n📋 CREDENCIAIS DE ACESSO:');
  console.log('----------------------------------------');
  console.log('👑 ADMIN:');
  console.log('   Email: admin@agentflow.com');
  console.log('   Senha: senha123');
  console.log('\n👔 MANAGER:');
  console.log('   Email: manager@agentflow.com');
  console.log('   Senha: senha123');
  console.log('\n👤 AGENTS:');
  console.log('   Email: agent1@agentflow.com');
  console.log('   Email: agent2@agentflow.com');
  console.log('   Email: agent3@agentflow.com');
  console.log('   Senha: senha123 (para todos)');
  console.log('========================================\n');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Garante que a conexão com o banco seja fechada
    await prisma.$disconnect();
  });
