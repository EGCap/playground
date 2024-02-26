import { SignIn, useUser } from '@clerk/clerk-react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';

const SignInPage = () => {
  const router = useRouter();
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard'); // Redirect to dashboard or another appropriate page
    }
  }, [isSignedIn, router]);

  return (
    <div>
      <SignIn path={router.asPath} routing="path" />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const { __session } = req.cookies;

  if (__session) {
    return {
      redirect: {
        destination: '/dashboard', // Redirect to dashboard or another appropriate page
        permanent: false,
      },
    };
  }

  return {
    props: {}, // will be passed to the page component as props
  };
};

export default SignInPage;