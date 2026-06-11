import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const sql = neon(process.env.DATABASE_URL!);

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Se process.env.AUTH_SECRET não for encontrado, usamos um valor fixo apenas para desenvolvimento
  secret: process.env.AUTH_SECRET || "um-segredo-super-longo-para-desenvolvimento", 
  providers: [
    Credentials({
      async authorize(credentials) {
        const email = credentials.email as string;
        const password = credentials.password as string;
        
        const res = await sql`SELECT * FROM admins WHERE email = ${email}`;
        const user = res[0];

        if (user && await bcrypt.compare(password, user.password_hash)) {
          return { id: user.id, email: user.email };
        }
        return null;
      },
    }),
  ],
  pages: { signIn: "/login" },
});