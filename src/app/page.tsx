
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { politicians } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, ArrowUpDown, ExternalLink, Filter } from 'lucide-react';
import { AccountabilityBadge } from '@/components/AccountabilityBadge';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'score' | 'forfeiture' | 'name'>('score');

  const filteredPoliticians = useMemo(() => {
    return politicians
      .filter(p => {
        const matchesSearch = p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.offices.some(o => o.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'score') return b.accountabilityScore - a.accountabilityScore;
        if (sortBy === 'forfeiture') return b.totalForfeiture - a.totalForfeiture;
        return a.fullName.localeCompare(b.fullName);
      });
  }, [searchQuery, statusFilter, sortBy]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero / Header Section */}
      <section className="mb-12 text-center md:text-left md:flex md:items-center md:justify-between bg-primary/5 p-8 rounded-2xl border border-primary/10">
        <div className="md:max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-primary mb-4 leading-tight">
            Who Owes Us?
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A public dashboard tracking the transparency, corruption records, and financial restitution status of public officials. Your window into civic accountability.
          </p>
        </div>
        <div className="hidden lg:block">
           <div className="bg-white p-6 rounded-xl shadow-sm border space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Restitution Tracker</p>
              <p className="text-3xl font-bold text-accent">${(politicians.reduce((sum, p) => sum + p.totalForfeiture, 0) / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-muted-foreground">Total Public Assets Recovered</p>
           </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="mb-8 grid gap-4 md:flex md:items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search politicians by name or office..." 
            className="pl-10 h-12 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] h-12 bg-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="convicted">Convicted</SelectItem>
              <SelectItem value="under investigation">Under Investigation</SelectItem>
              <SelectItem value="active">Active Duty</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
            <SelectTrigger className="w-[180px] h-12 bg-white">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score">Accountability Score</SelectItem>
              <SelectItem value="forfeiture">Forfeiture Amount</SelectItem>
              <SelectItem value="name">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Leaderboard Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPoliticians.map((p) => (
          <Link key={p.id} href={`/politician/${p.id}`}>
            <Card className="h-full hover:shadow-lg transition-all group overflow-hidden border-2 hover:border-primary/20">
              <CardHeader className="p-0">
                <div className="aspect-[4/3] relative bg-muted overflow-hidden">
                  <Image 
                    src={p.imageUrl} 
                    alt={p.fullName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <AccountabilityBadge score={p.accountabilityScore} className="shadow-md bg-white/95 backdrop-blur-sm" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-1 text-primary group-hover:text-accent transition-colors">{p.fullName}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-1">{p.offices.join(' • ')}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">Case Count</p>
                    <p className="text-lg font-bold">{p.caseCount}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">Forfeiture</p>
                    <p className="text-lg font-bold text-accent">${(p.totalForfeiture / 1000000).toFixed(1)}M</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-6 py-4 bg-secondary/30 border-t flex items-center justify-between">
                <span className="text-xs font-semibold capitalize px-2 py-1 rounded bg-white text-muted-foreground border">
                  {p.status}
                </span>
                <span className="text-primary text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View Profile <ExternalLink className="w-3 h-3" />
                </span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {filteredPoliticians.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed">
          <p className="text-muted-foreground text-lg">No politicians found matching your criteria.</p>
          <Button variant="link" onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}>Clear all filters</Button>
        </div>
      )}
    </div>
  );
}
