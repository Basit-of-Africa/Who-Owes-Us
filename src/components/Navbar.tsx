
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Trophy, BarChart3, Settings, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Leaderboard', href: '/', icon: Trophy },
    { name: 'Compare', href: '/compare', icon: BarChart3 },
    { name: 'Admin', href: '/admin', icon: Settings },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-accent p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
            <Info className="w-6 h-6 text-white" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tight">Who Owes Us?</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-accent-foreground",
                pathname === item.href ? "text-accent-foreground border-b-2 border-accent pb-1" : "text-primary-foreground/80"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors md:hidden">
            <Search className="w-5 h-5" />
          </button>
          <div className="hidden md:block relative">
             <span className="text-xs font-semibold bg-accent px-2 py-1 rounded text-white uppercase tracking-wider">Civic Accountability</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
