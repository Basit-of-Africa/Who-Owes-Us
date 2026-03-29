
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Trophy, BarChart3, Settings, Info, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { name: 'Compare', href: '/compare', icon: BarChart3 },
    { name: 'Admin', href: '/admin', icon: Settings },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-accent p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
            <Info className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <span className="font-headline font-bold text-lg md:text-xl tracking-tight">Who Owes Us?</span>
        </Link>

        {/* Desktop Nav */}
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

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:block relative">
             <span className="text-[10px] md:text-xs font-semibold bg-accent px-2 py-1 rounded text-white uppercase tracking-wider">National Accountability</span>
          </div>

          {/* Mobile Nav Toggle */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-primary-foreground hover:bg-white/10">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-primary border-none text-white w-[280px]">
              <SheetHeader className="text-left mb-8">
                <SheetTitle className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-2">
                  <Info className="w-5 h-5 text-accent" />
                  Navigation
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl transition-all font-bold uppercase tracking-widest text-xs",
                      pathname === item.href 
                        ? "bg-accent text-white shadow-lg" 
                        : "bg-white/5 text-white/70 hover:bg-white/10"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="mt-auto pt-10 border-t border-white/10 opacity-40 text-[10px] font-bold uppercase tracking-[0.2em]">
                Verified National Registry
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
