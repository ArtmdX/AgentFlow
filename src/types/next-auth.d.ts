import 'next-auth';
import 'next-auth/jwt';
import { AuthUser } from '@/types';

declare module 'next-auth' {
  interface Session {
    user: AuthUser;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: AuthUser;
  }
}
