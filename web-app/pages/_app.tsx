import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import '../styles/globals.css';

const frontendApi = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API;

if (!frontendApi) {
  console.error('The Clerk frontend API key is not set in the environment variables.');
} else {
  console.log(`Clerk frontend API key: ${frontendApi}`); // Added to log the API key at runtime
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <ClerkProvider 
      frontendApi={frontendApi || ''} 
      navigate={(to: string) => {
        router.push(to);
        // Explicitly return void to satisfy the type requirement
        return;
      }}
    >
      <SignedIn>
        <Component {...pageProps} />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </ClerkProvider>
  );
}

export default MyApp;