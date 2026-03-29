'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trophy, BarChart3, Settings, Menu, ShieldCheck } from 'lucide-react';
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
      <div className="container mx-auto px-6 md:px-[50px] h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-accent p-2 rounded-xl group-hover:rotate-6 transition-transform shadow-lg">
            <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg md:text-xl tracking-tighter leading-none uppercase">Who Owes Us?</span>
            <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-60">National Registry</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all hover:text-accent",
                pathname === item.href ? "text-accent border-b-2 border-accent pb-1" : "text-primary-foreground/80"
              )}
            >
              <item.icon className="w-3.5 h-3.5" />
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:block">
             <span className="text-[10px] font-black bg-accent/20 border border-accent/30 px-3 py-1 rounded-full text-accent uppercase tracking-widest">Nigeria 2024</span>
          </div>

          {/* Mobile Nav Toggle */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-primary-foreground hover:bg-white/10">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-primary border-none text-white w-[300px]">
              <SheetHeader className="text-left mb-10">
                <SheetTitle className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-accent" />
                  Audit Control
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-4 p-5 rounded-2xl transition-all font-black uppercase tracking-[0.2em] text-[10px]",
                      pathname === item.href 
                        ? "bg-accent text-white shadow-xl scale-[1.02]" 
                        : "bg-white/5 text-white/70 hover:bg-white/10"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="mt-auto pt-10 border-t border-white/10 opacity-40 text-[9px] font-black uppercase tracking-[0.4em] text-center">
                Public Record Archive
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
