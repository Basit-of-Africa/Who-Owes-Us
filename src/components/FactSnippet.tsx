'use client';

import { useState, useEffect } from 'react';
import { generateShareableFacts } from '@/ai/flows/generate-shareable-facts-flow';
import { Card, CardContent } from '@/components/ui/card';
import { Share2, Quote, Loader2, Twitter, MessageCircle } from 'lucide-react';
import { Politician } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function FactSnippet({ politician }: { politician: Politician }) {
  const [snippets, setSnippets] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadFacts() {
      if (!politician.id) return;
      setLoading(true);
      try {
        const result = await generateShareableFacts({
          fullName: politician.fullName,
          corruptionRecords: (politician.cases || []).map(c => ({
            caseTitle: c.title,
            description: c.description,
            convictionStatus: c.status,
            forfeitureAmount: c.amountInvolved,
            sources: (c.sources || []).map(s => s.url)
          }))
        });
        setSnippets(result.snippets);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadFacts();
  }, [politician.id]);

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-primary">
        <Share2 className="w-4 h-4 text-accent" />
        Social Snippets
      </h3>
      <div className="grid gap-3">
        {snippets.map((snippet, idx) => (
          <Card key={idx} className="bg-white border-l-4 border-accent group shadow-sm">
            <CardContent className="p-4 relative">
              <Quote className="w-8 h-8 text-accent/10 absolute top-2 right-2 group-hover:text-accent/20 transition-colors" />
              <p className="text-xs font-bold leading-relaxed pr-6 text-primary">{snippet}</p>
              <div className="flex gap-2 mt-4 justify-end">
                <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] gap-1 hover:bg-sky-50 text-sky-600">
                  <Twitter className="w-3 h-3" />
                  X
                </Button>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] gap-1 hover:bg-green-50 text-green-600">
                  <MessageCircle className="w-3 h-3" />
                  WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}