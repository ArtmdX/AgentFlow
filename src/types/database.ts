import { Customer as PrismaCustomer } from '@prisma/client';

export type CustomerFormData = Omit<PrismaCustomer, 'birthDate' | 'createdAt' | 'updatedAt'> & {
  birthDate: string;
  createdAt?: string;
  updatedAt?: string;
};
