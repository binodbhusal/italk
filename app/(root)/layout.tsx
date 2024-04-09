import StreamVideoProvider from '@/providers/StreamClientProvider';
import { Metadata } from 'next';
import React, { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'iTALK',
  description: 'Video calling app',
  icons: '/icons/logo.svg',
};
const RootLayout = ({ children }: { children:
ReactNode }) => (
  <main>
    <StreamVideoProvider>
      { children }
    </StreamVideoProvider>
    Footer
  </main>
);
export default RootLayout;
