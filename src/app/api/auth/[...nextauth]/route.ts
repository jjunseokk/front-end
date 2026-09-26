import NextAuth from 'next-auth';
import KakaoProvider from 'next-auth/providers/kakao';

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt', maxAge: 60 * 60 },
  providers: [
    KakaoProvider({
      authorization: { params: { scope: 'profile_nickname,account_email' } },
      clientId: process.env.KAKAO_CLIENT_ID || '',
      clientSecret: process.env.KAKAO_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === 'kakao') {
        token.kakaoAccessToken = account.access_token;
        token.kakaoExpiresAt = account.expires_at;
      }
      return token;
    },
  },
});
export { handler as GET, handler as POST };
