import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { headers } from "next/headers";
import UserModel from "../../../schemas/User";
import connectMongo from "../../../../util/mongo";
import createKey from "../../../../util/createKey";

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/auth/signout",
    error: "/auth/error", // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify-request", // (used for check email message)
    newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  callbacks: {
    async session({ session, token }) {
      // Return a cookie value as part of the session
      // This is read when `req.query.nextauth.includes("session") && req.method === "GET"`
      //  session.someCookie = test;

      await connectMongo();
      const headersList = headers();
      const findUser = await UserModel.findOne({ email: session.user.email });

      if (!findUser) {
        const create = new UserModel({
          email: session.user.email,
          avatar: session.user.image,
          apiKey: createKey(),
          created: Date.now(),
          ip: headersList.get("X-Forwarded-For"),
          credits: 2000,
          limits: {
            left: 2000,
            total: 2000,
          },
        });

        create
          .save()
          .then((savedUser) => {})
          .catch((error) => {
            console.error("Error creating user:", error);
          });
      }
      return session;
    },
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
  },
});

export { handler as GET, handler as POST };
