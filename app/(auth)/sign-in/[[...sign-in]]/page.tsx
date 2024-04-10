import React from 'react';
import { SignIn } from '@clerk/nextjs';

function SigninPage() {
  return (
    <main className="flex h-screen items-center justify-center">
      <SignIn />
    </main>
  );
}
export default SigninPage;
