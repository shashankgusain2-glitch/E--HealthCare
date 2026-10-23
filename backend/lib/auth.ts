import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./prisma";
import { sendOtp } from "./otp";
import { hashPassword, needsRehash } from "./password";
import { MINUTE, RateLimitError, blockedFor, consume, reset, waitText } from "./rate-limit";
import bcrypt from "bcrypt";

const MAX_FAILED_LOGINS = 10; // per email; then a 15-minute wait
const INVALID_LOGIN = "Invalid email or password";
const SIGN_IN_UNAVAILABLE = "Sign-in is unavailable right now. Please try again later.";
// Checked against when the email is unknown, so that path takes as long as a wrong password.
const DUMMY_HASH = bcrypt.hashSync("no-account-placeholder", 10);

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Username and password required");
        }

        const failKey = `login-fail:${credentials.email.trim().toLowerCase()}`;
        const wait = blockedFor(failKey, MAX_FAILED_LOGINS);
        if (wait) throw new Error(`Too many failed sign-in attempts. Please try again in ${waitText(wait)}.`);

        let user;
        try {
          user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
        } catch (error) {
          console.error("Sign-in failed:", error);
          throw new Error(SIGN_IN_UNAVAILABLE);
        }

        // One message (and similar timing) for an unknown email and a wrong password,
        // so the form can't reveal which emails have accounts.
        const isValid = await bcrypt.compare(credentials.password, user?.password || DUMMY_HASH);
        if (!user || !isValid) {
          consume(failKey, MAX_FAILED_LOGINS, 15 * MINUTE);
          throw new Error(INVALID_LOGIN);
        }

        if (!user.isEmailVerified) {
          try {
            await sendOtp(user.email);
          } catch (error) {
            if (error instanceof RateLimitError) throw new Error(error.message);
            console.error("Could not send the sign-in OTP:", error);
            throw new Error(SIGN_IN_UNAVAILABLE);
          }

          throw new Error("OTP sent to your email. Please verify before logging in.");
        }

        if (needsRehash(user.password)) {
          // Upgrade hashes made with the old, weaker work factor; sign-in still succeeds if this fails.
          await prisma.user
            .update({ where: { id: user.id }, data: { password: await hashPassword(credentials.password) } })
            .catch((error) => console.error("Could not upgrade password hash:", error));
        }

        reset(failKey);
        return {
          id: user.id,
          username: user.email,
          email: user.email,
          role: user.role,
          hospitalId: user.hospitalId
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },

  pages: {
    signIn: "/login", // optional
  },
  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (account.provider === "github" || account.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          const newUser = await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name || profile?.login || "User",
              password: "",
              role: "PATIENT",
              isEmailVerified: true,
            },
          });
          user.id = newUser.id;
          user.role = newUser.role;
          user.hospitalId = newUser.hospitalId;
        } else {
          user.id = existingUser.id;
          user.role = existingUser.role;
          user.hospitalId = existingUser.hospitalId;
        }
      }
      return true;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.hospitalId = user.hospitalId;
      } else if (token.email && !token.role) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { role: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
        }
      }
      return token;
    },

    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as 'PATIENT' | 'HOSPITAL_ADMIN' | 'HOSPITAL_STAFF' | 'DOCTOR' | 'SUPER_ADMIN';
        session.user.hospitalId = token.hospitalId as string | null;
      }
      return session;
    },
  },
}
