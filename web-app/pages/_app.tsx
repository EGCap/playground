import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/clerk-react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';
import '../styles/globals.css';

const frontendApi = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API;

if (!frontendApi) {
  console.error('The Clerk frontend API key is not set in the environment variables.');
} else {
  console.log(`Clerk frontend API key: ${frontendApi}`);
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const AuthComponent = withAuth(Component);

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
        <AuthComponent {...pageProps} />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </ClerkProvider>
  );
}

export default MyApp;

export function withAuth(Component: React.ComponentType) {
  return function AuthComponent(props: any) {
    const { isSignedIn } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (!isSignedIn) {
        router.push('/sign-in');
      }
    }, [isSignedIn, router]);

    if (typeof window !== 'undefined' && !isSignedIn) {
      return <></>;
    }

    return <Component {...props} />;
  };
}