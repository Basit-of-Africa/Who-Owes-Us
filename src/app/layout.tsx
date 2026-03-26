
import type {Metadata} from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <footer className="border-t bg-white py-12 mt-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} Who Owes Us? Project. Data provided for transparency and civic awareness.
            </p>
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
