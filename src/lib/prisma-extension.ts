import { passenger_type, Prisma } from '@prisma/client';

function calculateAge(birthDate: Date): number {
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export const PassengerTypeExtension = Prisma.defineExtension({
  result: {
    passenger: {
      passenger_type: {
        needs: { birthDate: true },
        compute(passenger) {
          if (!passenger.birthDate) {
            return 'adult';
          }
          const age = calculateAge(new Date(passenger.birthDate));

          if (age < 1) {
            return 'infant';
          }
          if (age < 12) {
            return 'child';
          }
          return 'adult';
        }
      }
    }
  }
});
