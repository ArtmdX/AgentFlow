// Configuração NextAuth
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from './prisma';
import bcrypt from 'bcryptjs';
import { AuthUser } from '@/types';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'Email' },
        password: { label: 'Password', type: 'password', placeholder: 'Senha' }
      },
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string };

        const user = await prisma.user.findUnique({
          where: { email }
        });

        // Se não encontrou ou está inativo, retorna null
        if (!user || user.isActive === false) return null;

        // Compara a senha informada com o hash salvo
        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) return null;

        // Retorna apenas os dados necessários do usuário
        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role
        };
      }
    })
  ],
  pages: {
    signIn: '/auth/login'
  },
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as AuthUser;
      return session;
    }
  }
};
