import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
interface IUser {
      _id: string;
      username: string;
      email: string;
      isVerified: boolean;
      role: string;
      type: string;
}
declare module "next-auth/jwt" {
      interface JWT {
            access_token: string;
            refresh_token: string;
            user: IUser;
      }
}

declare module "next-auth" {
      interface Session {
            access_token: string;
            refresh_token: string;
            user: IUser & DefaultSession["user"];
      }
}