
import AppHeader from '@/components/header/app.header';
import AppFooter from '@/components/footer/app.footer';
import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '',
  description: ''
}
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppHeader />
      {children}
      <div style={{ marginBottom: "100px" }} />
      <AppFooter />
    </>
  );
}
