import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import googleProvider from 'next-auth/providers/google';
import mongoDB from 'middlewares/database';
import { compare } from 'bcryptjs';

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) throw new Error('env error');

export default NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
    updateAge: 2 * 24 * 60 * 60,
  },
  providers: [
    googleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        const { client, db } = await mongoDB();

        const user = await db.collection('users').findOne({
          email: credentials!.email,
        });

        if (!user) {
          client.close();
          throw new Error('함께하고 있는 계정이 아니에요:(');
        }

        const isValid = await compare(credentials!.password, user.password);

        if (!isValid) {
          client.close();
          throw new Error('비밀번호가 일치하지 않아요ㅠ.ㅠ');
        }
        client.close();

        return { id: user._id.toString() };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      let id = '';

      if (account?.provider === 'google') {
        const { client, db } = await mongoDB();

        const user = await db.collection('users').findOne({
          email: token.email,
          provider: 'GOOGLE',
        });

        if (!user) {
          await db.collection('users').insertOne({
            name: token.name,
            email: token.email,
            password: '',
            career: '',
            profile: token.picture,
            introduce: '',
            provider: 'GOOGLE',
          });

          const targetUser = await db.collection('users').findOne({
            email: token.email,
            provider: 'GOOGLE',
          });

          id = targetUser._id.toString();
          client.close();
        } else {
          id = user._id.toString();
        }
      }

      return { ...token, id };
    },
    session({ session, token }) {
      console.log(token);
      session.user.userId = token.sub;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
});
