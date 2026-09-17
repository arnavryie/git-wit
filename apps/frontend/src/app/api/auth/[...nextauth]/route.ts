import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID || "mock-client-id",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "mock-client-secret",
      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
      checks: ["state"],
    }),
    Credentials({
      id: "credentials",
      name: "Demo Account",
      credentials: {
        username: { label: "Username", type: "text" },
      },
      async authorize(credentials) {
        const username = (credentials?.username as string) || "arnavryie";
        return {
          id: "demo-user-" + username,
          name: username,
          email: `${username}@users.noreply.github.com`,
          image: `https://github.com/${username}.png`,
          login: username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account?.access_token) {
        token.githubAccessToken = account.access_token
      }
      if (profile) {
        token.githubLogin = (profile as any).login as string
      }
      if (user) {
        token.githubLogin = (user as any).login || user.name || "arnavryie"
        if (!token.githubAccessToken) {
          token.githubAccessToken = "demo-access-token"
        }
      }
      return token
    },
    async session({ session, token }) {
      (session as any).githubAccessToken = (token.githubAccessToken as string) || "demo-access-token"
      ;(session as any).githubLogin = (token.githubLogin as string) || "arnavryie"
      if (session.user) {
        (session.user as any).login = (token.githubLogin as string) || "arnavryie"
      }
      return session
    },
  },
})

