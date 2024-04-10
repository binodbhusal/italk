import { SignUp } from '@clerk/nextjs';
import React from 'react';

function SignupPage() {
  return (
    <main className="flex h-screen items-center justify-center">
      <SignUp />
    </main>
  );
}
export default SignupPage;
