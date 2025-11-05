/**
 * Validation Schemas - Central Export
 *
 * Importa e exporta todos os schemas de validação
 */

// Validators
export * from './validators';

// Customer schemas
export * from './customer';

// Passenger schemas
export * from './passenger';

// Travel schemas
export * from './travel';

// Payment schemas (mantém os existentes do validations.ts)
export {
  paymentCreateSchema,
  paymentUpdateSchema,
} from '../validations';

// User/Auth schemas
export * from './user';

// Legacy schemas (mantém os existentes do validations.ts)
export {
  registerSchema,
} from '../validations';
