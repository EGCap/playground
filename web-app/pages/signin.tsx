
import { SignIn } from '@clerk/clerk-react';
import { useRouter } from 'next/router';
import React from 'react';

const SignInPage = () => {
  const router = useRouter();

  return (
    <div>
      <SignIn path={router.asPath} routing="path" />
    </div>
  );
};

export default SignInPage;