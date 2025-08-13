// Cliente Prisma
import { PrismaClient } from '@prisma/client';
import { PassengerTypeExtension } from './prisma-extension';
const prisma = new PrismaClient().$extends(PassengerTypeExtension);

export default prisma;
