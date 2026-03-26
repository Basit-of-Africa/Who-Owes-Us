
'use client';

import { useState, useEffect } from 'react';
import { generateShareableFacts } from '@/ai/flows/generate-shareable-facts-flow';
import { Card, CardContent } from '@/components/ui/card';
import { Share2, Quote, Loader2, Twitter, Facebook } from 'lucide-react';
import { Politician } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function FactSnippet({ politician }: { politician: Politician }) {
  const [snippets, setSnippets] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadFacts() {
      setLoading(true);
      try {
        const result = await generateShareableFacts({
          fullName: politician.fullName,
          corruptionRecords: politician.cases.map(c => ({
            caseTitle: c.title,
            description: c.description,
            convictionStatus: c.status,
            forfeitureAmount: c.forfeitureAmount,
            sources: c.sources
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

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Share2 className="w-5 h-5 text-primary" />
        Spread the Word
      </h3>
      <div className="grid gap-4">
        {snippets.map((snippet, idx) => (
          <Card key={idx} className="bg-white border-l-4 border-accent">
            <CardContent className="p-4 relative">
              <Quote className="w-8 h-8 text-accent/10 absolute top-2 right-2" />
              <p className="text-sm font-medium leading-relaxed pr-8">{snippet}</p>
              <div className="flex gap-2 mt-4 justify-end">
                <Button variant="outline" size="sm" className="h-8 gap-2">
                  <Twitter className="w-3.5 h-3.5 text-sky-500" />
                  Tweet
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-2">
                  <Facebook className="w-3.5 h-3.5 text-blue-600" />
                  Post
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
