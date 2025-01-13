
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function DashLayout({ children }: RootLayoutProps) {
  return (
        <div className={inter.className}>
        <Navbar/>
          {children}
        </div>
  );
}
