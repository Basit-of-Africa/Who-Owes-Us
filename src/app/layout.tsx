import type {Metadata} from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseProvider } from '@/firebase/provider';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Who Owes Us? | Politician Accountability Tracker',
  description: 'Tracking transparency and civic duty by monitoring corruption records and accountability scores of public officials.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen flex flex-col" suppressHydrationWarning>
        <FirebaseProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <footer className="border-t bg-white py-12 mt-20 px-6 md:px-[50px]">
            <div className="container mx-auto text-center space-y-4">
              <p className="text-muted-foreground text-sm font-medium">
                &copy; {new Date().getFullYear()} Who Owes Us? Project. Independent Nigerian Civic Tech Initiative.
              </p>
              <div className="flex justify-center gap-6">
                <Link href="/disclaimer" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors">
                  Legal Disclaimer
                </Link>
                <Link href="/leaderboard" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors">
                  National Registry
                </Link>
              </div>
            </div>
          </footer>
          <Toaster />
        </FirebaseProvider>
      </body>
    </html>
  );
}
