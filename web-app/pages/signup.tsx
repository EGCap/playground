
import { SignUp } from '@clerk/clerk-react';
import { useRouter } from 'next/router';
import React from 'react';

const SignUpPage = () => {
  const router = useRouter();

  return (
    <div>
      <SignUp path={router.asPath} routing="path" />
    </div>
  );
};

export default SignUpPage;